with open("update_senha.js", "w") as f:
    f.write('const {Pool} = require("pg");\n')
    f.write('const bcrypt = require("bcryptjs");\n')
    f.write('const pool = new Pool({connectionString: "postgresql://postgres:postgres@127.0.0.1:5432/ponto_db"});\n')
    f.write('bcrypt.hash("admin123", 10).then(h => {\n')
    f.write('  pool.query("UPDATE funcionarios SET senha_hash=$1 WHERE email=$2", [h, "admin@empresa.com"])\n')
    f.write('  .then(() => { console.log("Senha atualizada!"); pool.end(); });\n')
    f.write('});\n')
print("ok")
