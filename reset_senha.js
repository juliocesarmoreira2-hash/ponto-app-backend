const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://postgres:postgres@127.0.0.1:5432/ponto_db' });
bcrypt.hash('joao123', 10).then(hash => {
  pool.query('UPDATE funcionarios SET senha_hash = $1 WHERE email = $2', [hash, 'joao@empresa.com']).then(() => {
    console.log('Senha atualizada!');
    pool.end();
  });
});
