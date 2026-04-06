CREATE TABLE funcionarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  cargo VARCHAR(100),
  departamento VARCHAR(100),
  perfil VARCHAR(20) DEFAULT 'funcionario',
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE registros_ponto (
  id SERIAL PRIMARY KEY,
  funcionario_id INT REFERENCES funcionarios(id),
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('entrada','intervalo_inicio','intervalo_fim','saida','hora_extra')),
  data_hora TIMESTAMP DEFAULT NOW(),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  foto_url TEXT,
  observacao TEXT
);