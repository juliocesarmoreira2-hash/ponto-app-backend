const pool = require('../config/database');
const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const streamifier = require('streamifier');

// memoryStorage: foto fica em buffer (req.file.buffer), sem gravar em disco
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Apenas imagens são permitidas'), false);
  }
});
exports.upload = upload.single('foto');

// Upload direto para Cloudinary via stream (sem disco)
function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'ponto-app', resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}
exports.registrar = async (req, res) => {
  try {
    console.log('BODY:', req.body);
    console.log('FILE:', req.file ? req.file.originalname : 'SEM FOTO');
    const { tipo, latitude, longitude, observacao } = req.body;
    const funcionario_id = req.usuario.id;
    let foto_url = null;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      foto_url = result.secure_url;
      console.log('CLOUDINARY URL:', foto_url);
    }

    const ponto = await pool.query(
      'INSERT INTO registros_ponto (funcionario_id, tipo, latitude, longitude, foto_url, observacao) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [funcionario_id, tipo, latitude, longitude, foto_url, observacao]
    );
    res.json({ sucesso: true, ponto: ponto.rows[0] });
  } catch (e) {
    console.error('Erro ao registrar ponto:', e);
    res.status(500).json({ erro: e.message });
  }
};

exports.meusPontos = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM registros_ponto WHERE funcionario_id = $1 ORDER BY data_hora DESC LIMIT 50',
      [req.usuario.id]
    );
    res.json(result.rows);
  } catch (e) { res.status(500).json({ erro: e.message }); }
};

exports.todosPontos = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT rp.*, f.nome, f.cargo FROM registros_ponto rp JOIN funcionarios f ON f.id = rp.funcionario_id ORDER BY rp.data_hora DESC',
      []
    );
    res.json(result.rows);
  } catch (e) { res.status(500).json({ erro: e.message }); }
};
