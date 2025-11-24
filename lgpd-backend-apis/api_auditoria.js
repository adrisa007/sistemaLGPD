// api_auditoria.js
const express = require('express');
const { query } = require('./db');
const app = express();
app.use(express.json());

const port = process.env.PORT || 8080;

// Rota de saúde (Health Check)
app.get('/', (req, res) => {
  res.status(200).json({
    message: "API de Auditoria (Fase 2) - OK",
    service: "auditoria"
  });
});

// ##################################################################
// Rotas para LOG_ACESSO_DADOS (Auditoria) - Etapa 8
// ##################################################################

// POST /log: Cria um novo Registro de Log de Acesso
app.post('/log', async (req, res) => {
  const { id_uso, usuario_acessor, status_consentimento_momento } = req.body;
  
  if (!id_uso || !usuario_acessor || !status_consentimento_momento) {
    return res.status(400).json({ error: "ID de Uso, Usuário Acessor e Status de Consentimento são obrigatórios." });
  }

  try {
    const sql = `
      INSERT INTO LOG_ACESSO_DADOS (ID_USO, USUARIO_ACESSOR, STATUS_CONSENTIMENTO_MOMENTO)
      VALUES (?, ?, ?)
    `;
    const result = await query(sql, [id_uso, usuario_acessor, status_consentimento_momento]);
    
    res.status(201).json({ 
      message: "Log de acesso registrado com sucesso.", 
      id: result.insertId 
    });
  } catch (error) {
    console.error("Erro ao registrar log de acesso:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

app.listen(port, () => {
  console.log(`API de Auditoria rodando na porta ${port}`);
});