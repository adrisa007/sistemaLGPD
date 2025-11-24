const express = require('express');
const { pool, testConnection } = require('./db'); // Ajustado para o caminho correto
const app = express();

// Middlewares
app.use(express.json()); // Adiciona o middleware para parsear JSON no corpo das requisições

// Importar Roteadores dos Módulos
const governancaRouter = require('./api_governanca.js');
const usoDadosRouter = require('./api_uso_dados.js');
const auditoriaRouter = require('./api_auditoria.js');
const solicitacoesRouter = require('./api_solicitacoes.js');
const relatoriosRouter = require('./api_relatorios.js');

// Rotas
app.get('/', (req, res) => {
  res.status(200).send('API Gateway LGPD está funcionando!');
});

app.use('/governanca', governancaRouter);
app.use('/uso-dados', usoDadosRouter);
app.use('/auditoria', auditoriaRouter);
app.use('/solicitacoes', solicitacoesRouter);
app.use('/relatorios', relatoriosRouter);

const PORT = process.env.PORT || 8080;
let server;

// Inicia o servidor e testa a conexão com o banco de dados
if (require.main === module) {
  server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    testConnection();
  });
}

// Tratamento para encerramento gracioso (Graceful Shutdown)
const gracefulShutdown = (signal) => {
  console.log(`${signal} received. Closing HTTP server.`);
  if (server) {
    server.close(() => {
      console.log('HTTP server closed.');
      pool.end(err => {
        if (err) console.error('Error closing the database connection pool:', err);
        else console.log('Database connection pool closed.');
        process.exit(err ? 1 : 0);
      });
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

module.exports = app;