with open("src/controllers/pontoController.js", "w", encoding="utf-8") as f:
    f.write("""const pool = require('../config/database');
const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
exports.upload = upload.single('foto');

exports.registrar = async (req, res) => {
  try {
    const { tipo, latitude, longitude, observacao } = req.body;
    const funcionario_id = req.usuario.id;
    let foto_url = null;
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ folder: 'pontos' }, (err, r) => {
          if (err) reject(err); else resolve(r);
        }).end(req.file.buffer);
      });
      foto_url = result.secure_url;
    }
    const ponto = await pool.query(
      'INSERT INTO registros_ponto (funcionario_id, tipo, latitude, longitude, foto_url, observacao) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [funcionario_id, tipo, latitude, longitude, foto_url, observacao]
    );
    res.json({ sucesso: true, ponto: ponto.rows[0] });
  } catch (e) { res.status(500).json({ erro: e.message }); }
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
""")
print("Feito!")
