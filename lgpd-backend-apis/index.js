// index.js - Ponto de entrada da aplicação

const app = require('./server'); // Importa a configuração do app Express
const { pool, testConnection } = require('./db'); // Importa o pool e o teste de conexão

const PORT = process.env.PORT || 8080;

// Inicia o servidor
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  // Testa a conexão com o banco de dados APÓS o servidor começar a ouvir
  testConnection();
});

// Tratamento para encerramento gracioso (Graceful Shutdown)
const gracefulShutdown = (signal) => {
  console.log(`${signal} received. Closing HTTP server.`);
  server.close(() => {
    console.log('HTTP server closed.');
    // Fecha o pool de conexões do banco de dados
    pool.end(err => {
      if (err) console.error('Error closing the database connection pool:', err);
      else console.log('Database connection pool closed.');
      process.exit(err ? 1 : 0);
    });
  });
};

// Ouve os sinais de encerramento
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT')); // Adicionado para testes locais (Ctrl+C)