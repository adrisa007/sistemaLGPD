//db.js - Configuração do Pool de Conexões com MySQL
const mysql = require('mysql2/promise');

// Configuração do Pool de Conexões
const poolConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Se a variável de ambiente CLOUD_SQL_CONNECTION_NAME estiver definida (no Cloud Run),
// usa o socket Unix para a conexão. Caso contrário (desenvolvimento local), usa o host TCP.
if (process.env.CLOUD_SQL_CONNECTION_NAME) {
  poolConfig.socketPath = `/cloudsql/${process.env.CLOUD_SQL_CONNECTION_NAME}`;
  // Garante que o host não seja usado no modo Cloud Run
  delete poolConfig.host; 
} else {
  poolConfig.host = process.env.DB_HOST || '127.0.0.1';
}

const pool = mysql.createPool(poolConfig);

// Função para testar a conexão
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Successfully connected to the database.');
    connection.release(); // Libera a conexão de volta para o pool
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    // Encerra a aplicação se a conexão com o DB falhar na inicialização (Cloud Run)
    console.error('Application will exit...');
    process.exit(1); 
  }
};

module.exports = {
  // Exporta o pool para ser usado em consultas
  pool,
  // Exporta a função de teste para ser usada no index.js
  testConnection,
  // NOVO: Exporta o método 'query' do pool para simplificar o uso em outros módulos (como api_auth.js)
  query: pool.query, 
};