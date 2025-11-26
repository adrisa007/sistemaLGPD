// db.js - Configuração do Pool de Conexões com MySQL

const mysql = require('mysql2/promise');

// Configuração base do Pool de Conexões (lê as variáveis do ambiente)
const poolConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  
  // Configurações de pool
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// ESSENCIAL: Lógica para alternar entre Cloud Run (Socket) e Desenvolvimento Local (Host/TCP)
if (process.env.CLOUD_SQL_CONNECTION_NAME) {
  // Cloud Run: Usa o socket path injetado pelo proxy do Cloud SQL
  poolConfig.socketPath = `/cloudsql/${process.env.CLOUD_SQL_CONNECTION_NAME}`;
  
  // Remove 'host' para evitar conflito com o socket path
  delete poolConfig.host; 
  console.log('Modo de conexão: Cloud Run (Socket Unix)');
} else {
  // Desenvolvimento local: Usa host ou 127.0.0.1
  poolConfig.host = process.env.DB_HOST || '127.0.0.1';
  console.log(`Modo de conexão: Local (Host: ${poolConfig.host})`);
}

const pool = mysql.createPool(poolConfig);

// Função para testar a conexão com o banco de dados antes de iniciar o servidor Express
const testConnection = async () => {
    let connection;
    try {
        console.log('--- TESTE DB INICIADO ---');
        console.log('Tentando obter uma conexão com o banco de dados...');
        
        // Tenta obter uma conexão. Se falhar, lança o erro.
        connection = await pool.getConnection(); 
        
        // Libera a conexão de volta para o pool
        connection.release(); 
        
        console.log('Conexão com o banco de dados estabelecida com sucesso. ✅');
        console.log('--- TESTE DB CONCLUÍDO ---');
        return true;
        
    } catch (error) {
        // # MELHORIA NO LOGGING (Crucial para Cloud Run) #
        // Imprime a mensagem de erro específica do MySQL de forma fácil de buscar.
        console.error('##################################################');
        console.error('### ERRO FATAL: FALHA AO CONECTAR AO CLOUD SQL ### 🚨');
        console.error(`### MENSAGEM DO DB: ${error.message} ###`); 
        console.error('##################################################');

        if (connection) {
            connection.release();
        }
        
        // Encerra a aplicação para que o Cloud Run registre a falha.
        process.exit(1); 
    }
};

module.exports = {
  // Exporta o pool para ser usado em consultas
  pool,
  // Exporta a função de teste para ser usada no index.js
  testConnection,
  // Exporta o método 'query' do pool para simplificar o uso
  query: pool.query, 
};
