// server.js - Configuração e Middlewares do Express
const express = require('express');
const cors = require('cors'); // Middleware CORS (essencial para comunicação Frontend/Backend)
const morgan = require('morgan'); // Para logging de requisições HTTP (útil para debug)

// Importa as Rotas
const authRoutes = require('./api_auth'); // Rotas de Autenticação (Login)
const auditoriaRoutes = require('./api_auditoria'); // Rotas de Auditoria
// Importe as outras rotas conforme necessário (governança, relatórios, etc.)

const app = express();

// --- Middlewares Essenciais ---

// 1. Logging de Requisições
app.use(morgan('combined')); 

// 2. CORREÇÃO CORS
// ESSENCIAL para permitir que o Frontend no Codespace (URL dinâmica) se comunique com a API no Cloud Run.
// Em produção, você idealmente limitaria 'origin' ao domínio final do seu frontend.
app.use(cors({
    origin: '*', // Permite todas as origens (para desenvolvimento)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'] // Permite cabeçalhos necessários para JWT
}));

// 3. Parser de Corpo (Body Parser)
// Permite que a aplicação leia dados JSON enviados no corpo da requisição (POST/PUT)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// --- Rotas da API ---

// Rota de Status (Health Check)
app.get('/status', (req, res) => {
    res.status(200).send({ message: 'API LGPD está saudável e operacional!' });
});

// Rotas de Autenticação (Login)
app.use('/api/v1/auth', authRoutes);

// Rotas Protegidas (Exemplo: auditoria)
app.use('/api/v1/auditoria', auditoriaRoutes);

// Adicione as outras rotas aqui:
// app.use('/api/v1/governanca', governancaRoutes);
// app.use('/api/v1/solicitacoes', solicitacoesRoutes);
// app.use('/api/v1/relatorios', relatoriosRoutes);
// app.use('/api/v1/uso-dados', usoDadosRoutes);


// --- Tratamento de Erros ---

// Tratamento de rota não encontrada (404)
app.use((req, res, next) => {
    const error = new Error(`Não Encontrado - ${req.originalUrl}`);
    res.status(404);
    next(error);
});

// Handler de Erros Genericos
app.use((error, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: error.message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack // Oculta o stack em produção
    });
});

module.exports = app;