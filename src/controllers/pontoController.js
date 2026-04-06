const pool = require('../config/database');
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '_ponto.jpg');
  }
});

const upload = multer({ storage });
exports.upload = upload.single('foto');

exports.registrar = async (req, res) => {
  try {
    console.log('BODY:', req.body);
    console.log('FILE:', req.file ? req.file.filename : 'NAO');
    const { tipo, latitude, longitude, observacao } = req.body;
    const funcionario_id = req.usuario.id;
    let foto_url = null;
    if (req.file) {
      foto_url = 'http://192.168.1.15:3000/uploads/' + req.file.filename;
    }
    const ponto = await pool.query(
      'INSERT INTO registros_ponto (funcionario_id, tipo, latitude, longitude, foto_url, observacao) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [funcionario_id, tipo, latitude, longitude, foto_url, observacao]
    );
    res.json({ sucesso: true, ponto: ponto.rows[0] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ erro: e.message });
  }
};

exports.meusPontos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM registros_ponto WHERE funcionario_id = $1 ORDER BY data_hora DESC LIMIT 50', [req.usuario.id]);
    res.json(result.rows);
  } catch (e) { res.status(500).json({ erro: e.message }); }
};

exports.todosPontos = async (req, res) => {
  try {
    const result = await pool.query('SELECT rp.*, f.nome, f.cargo FROM registros_ponto rp JOIN funcionarios f ON f.id = rp.funcionario_id ORDER BY rp.data_hora DESC', []);
    res.json(result.rows);
  } catch (e) { res.status(500).json({ erro: e.message }); }
};
