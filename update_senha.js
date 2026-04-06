const {Pool} = require("pg");
const bcrypt = require("bcryptjs");
const pool = new Pool({connectionString: "postgresql://postgres:postgres@127.0.0.1:5432/ponto_db"});
bcrypt.hash("admin123", 10).then(h => {
  pool.query("UPDATE funcionarios SET senha_hash=$1 WHERE email=$2", [h, "admin@empresa.com"])
  .then(() => { console.log("Senha atualizada!"); pool.end(); });
});
