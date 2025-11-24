const express = require('express');
require('dotenv').config();
const rootRoutes = require('./routes/rootRoutes');
const titularRoutes = require('./routes/titularRoutes');
const { query } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Permite que o servidor leia JSON no body da requisição

// Teste de Conexão com DB
query('SELECT NOW()')
  .then(res => console.log('Conexão com o Banco de Dados estabelecida com sucesso!'))
  .catch(err => console.error('Erro ao conectar ao DB:', err.stack));

// Rotas do Sistema
app.use('/api/root', rootRoutes);
app.use('/api/titular', titularRoutes);

// Rota de saúde (para Cloud Run)
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Iniciando o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`URL: http://localhost:${PORT}`);
});