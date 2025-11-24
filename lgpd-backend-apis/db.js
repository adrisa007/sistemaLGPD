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

// Se a variável de ambiente INSTANCE_CONNECTION_NAME estiver definida (no Cloud Run),
// usa o socket Unix para a conexão. Caso contrário (desenvolvimento local), usa o host TCP.
if (process.env.INSTANCE_CONNECTION_NAME) {
  poolConfig.socketPath = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
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
    // Em um ambiente de produção, você pode querer encerrar o processo se a conexão com o DB falhar na inicialização
    // process.exit(1);
    console.error('Application will exit...');
    process.exit(1); // Encerra a aplicação se a conexão com o DB falhar na inicialização
  }
};

module.exports = {
  // Exporta o pool para ser usado em consultas
  pool,
  // Exporta a função de teste para ser usada no server.js
  testConnection,
};
