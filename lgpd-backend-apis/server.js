// server.js (API Gateway/Monolito Modular)
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080; // Usar 8080, padrão do Cloud Run

// Middleware para processar JSON
app.use(express.json());

// Rota de saúde (Health Check) para o serviço principal
app.get('/', (req, res) => {
  res.status(200).json({
    message: "LGPD Backend API Gateway - OK",
    status: "Running all modules"
  });
});

// ##################################################################
// Importar e Usar as Rotas de Cada Módulo (APIs)
// ##################################################################

// 1. FASE 1: Governança (Entidades e Cargos)
const governancaRoutes = require('./api_governanca');
app.use('/governanca', governancaRoutes);

// 2. FASE 2: Uso de Dados (Titulares, Usos, Checagem)
const usoDadosRoutes = require('./api_uso_dados');
app.use('/uso-dados', usoDadosRoutes);

// 3. FASE 2: Auditoria (Log de Acesso)
const auditoriaRoutes = require('./api_auditoria');
app.use('/auditoria', auditoriaRoutes);

// 4. FASE 3: Solicitações (Direitos do Titular)
const solicitacoesRoutes = require('./api_solicitacoes');
app.use('/solicitacoes', solicitacoesRoutes);

// 5. FASE 4: Relatórios (Auditoria e Prova Final)
const relatoriosRoutes = require('./api_relatorios');
app.use('/relatorios', relatoriosRoutes);

// ##################################################################
// Iniciar o Servidor
// ##################################################################

app.listen(PORT, () => {
  console.log(`Servidor LGPD Backend rodando na porta ${PORT}`);
});
