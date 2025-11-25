//server.js - Configuração do servidor Express e middlewares
const express = require('express');
const cors = require('cors'); // 🔑 Essencial para o Frontend
const helmet = require('helmet'); // Boa prática de segurança
const app = express();

// --- 1. Middlewares de Segurança e Parsing ---

// Habilita o CORS. Permite que o frontend React acesse a API.
// Em um ambiente de produção final, você deve configurar para permitir apenas a URL do seu frontend.
app.use(cors({
    origin: '*', // Temporariamente permite todas as origens para o desenvolvimento no Codespaces/github.dev
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Adiciona headers de segurança (como XSS protection, etc.)
app.use(helmet()); 

// Middleware para parsear o corpo das requisições como JSON
app.use(express.json()); 

// --- 2. Importar Roteadores dos Módulos ---

// 🔑 Roteador de AUTENTICAÇÃO: O seu frontend precisa deste módulo para fazer login.
const authRouter = require('./api_auth.js'); 

const governancaRouter = require('./api_governanca.js');
const usoDadosRouter = require('./api_uso_dados.js');
const auditoriaRouter = require('./api_auditoria.js');
const solicitacoesRouter = require('./api_solicitacoes.js');
const relatoriosRouter = require('./api_relatorios.js');


// --- 3. Rotas Base (Mapeamento com Prefixo /api/v1) ---

// Rota de Teste de Saúde (Health Check)
app.get('/', (req, res) => {
  res.status(200).send('API Gateway LGPD está funcionando!');
});

// Mapeamento das rotas dos módulos
app.use('/api/v1/auth', authRouter); // 🔑 Rota de Login/Autenticação
app.use('/api/v1/governanca', governancaRouter);
app.use('/api/v1/uso-dados', usoDadosRouter);
app.use('/api/v1/auditoria', auditoriaRouter);
app.use('/api/v1/solicitacoes', solicitacoesRouter);
app.use('/api/v1/relatorios', relatoriosRouter);


// --- 4. Tratamento de Erro (Middlewares Finais) ---

// Lida com rotas não encontradas (404)
app.use((req, res, next) => {
    res.status(404).json({ message: 'Recurso não encontrado (404)' });
});

// Middleware de Tratamento de Erro Geral
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ 
        message: 'Erro interno do servidor.',
        detail: err.message
    });
});

module.exports = app;