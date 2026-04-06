const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    const result = await pool.query('SELECT * FROM funcionarios WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user || !await bcrypt.compare(senha, user.senha_hash))
      return res.status(401).json({ erro: 'Credenciais invalidas' });
    const token = jwt.sign({ id: user.id, nome: user.nome, perfil: user.perfil }, process.env.JWT_SECRET, { expiresIn: '12h' });
    res.json({ token, usuario: { id: user.id, nome: user.nome, email: user.email, perfil: user.perfil } });
  } catch (e) { res.status(500).json({ erro: e.message }); }
};
exports.cadastrar = async (req, res) => {
  try {
    const { nome, email, senha, cargo, departamento } = req.body;
    const hash = await bcrypt.hash(senha, 10);
    const result = await pool.query('INSERT INTO funcionarios (nome, email, senha_hash, cargo, departamento) VALUES ($1,$2,$3,$4,$5) RETURNING id, nome, email', [nome, email, hash, cargo, departamento]);
    res.json({ sucesso: true, funcionario: result.rows[0] });
  } catch (e) { res.status(500).json({ erro: e.message }); }
};