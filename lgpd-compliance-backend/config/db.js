const { Pool } = require('pg');
require('dotenv').config();

// Configuração do pool de conexão com o Cloud SQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
      // Em produção no GCP, use arquivos de certificado
      rejectUnauthorized: false
  }
});

pool.on('error', (err) => {
  console.error('Erro inesperado no pool do banco de dados:', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};