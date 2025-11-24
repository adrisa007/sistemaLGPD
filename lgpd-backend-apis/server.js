const express = require('express');
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

module.exports = app;