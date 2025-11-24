// db.js
// Módulo de conexão com o Cloud SQL (MySQL) via Unix Socket

const mysql = require('mysql2/promise');

// Variáveis de ambiente injetadas pelo Cloud Run
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;
const instanceConnectionName = process.env.INSTANCE_CONNECTION_NAME;

// Cria o pool de conexões
const pool = mysql.createPool({
  user: dbUser,
  password: dbPassword,
  database: dbName,
  // Configuração crucial para a conexão via Unix Socket no Cloud Run
  socketPath: `/cloudsql/${instanceConnectionName}`,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

/**
 * Executa uma consulta SQL no banco de dados.
 * @param {string} sql - A string SQL a ser executada.
 * @param {Array} [values=[]] - Um array de valores para substituir os placeholders na string SQL.
 * @returns {Promise<Array>} - O resultado da consulta.
 */
async function query(sql, values = []) {
  try {
    // O pool gerencia a obtenção e liberação da conexão
    const [rows, fields] = await pool.execute(sql, values);
    return rows;
  } catch (error) {
    console.error("Erro na consulta SQL:", error.message);
    // Re-lança o erro para ser tratado pela API que chamou a função
    throw error;
  }
}

module.exports = {
  query,
  pool
};
