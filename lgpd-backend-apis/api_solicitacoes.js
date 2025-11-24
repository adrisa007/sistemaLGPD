// api_solicitacoes.js
const express = require('express');
const { query } = require('./db'); // Importa o módulo de conexão
const app = express();
app.use(express.json());

const port = process.env.PORT || 8080;

// Rota de saúde (Health Check)
app.get('/', (req, res) => {
  res.status(200).json({
    message: "API de Solicitações (Fase 3) - OK",
    service: "solicitacoes"
  });
});

// ##################################################################
// Rotas para SOLICITACOES_LGPD (Direitos do Titular) - Módulo V
// ##################################################################

// POST /solicitacoes: Registra uma nova solicitação do titular
app.post('/solicitacoes', async (req, res) => {
  const { id_titular, tipo_solicitacao, descricao_solicitacao } = req.body;
  
  if (!id_titular || !tipo_solicitacao) {
    return res.status(400).json({ error: "ID do Titular e Tipo de Solicitação são obrigatórios." });
  }

  // O status inicial é sempre 'Pendente'
  const status_solicitacao = 'Pendente';
  
  try {
    const sql = `
      INSERT INTO SOLICITACOES_LGPD (ID_TITULAR, TIPO_SOLICITACAO, DESCRICAO_SOLICITACAO, STATUS_SOLICITACAO)
      VALUES (?, ?, ?, ?)
    `;
    const result = await query(sql, [id_titular, tipo_solicitacao, descricao_solicitacao || null, status_solicitacao]);
    
    res.status(201).json({ 
      message: "Solicitação registrada com sucesso.", 
      id: result.insertId,
      status: status_solicitacao
    });
  } catch (error) {
    console.error("Erro ao registrar solicitação:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

// GET /solicitacoes/:id_titular: Lista todas as solicitações de um titular
app.get('/solicitacoes/:id_titular', async (req, res) => {
  const { id_titular } = req.params;
  
  try {
    const sql = `
      SELECT * FROM SOLICITACOES_LGPD
      WHERE ID_TITULAR = ?
      ORDER BY DATA_SOLICITACAO DESC
    `;
    const solicitacoes = await query(sql, [id_titular]);
    
    res.status(200).json(solicitacoes);
  } catch (error) {
    console.error("Erro ao listar solicitações:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

// PUT /solicitacoes/:id_solicitacao: Atualiza o status de uma solicitação (para uso interno)
app.put('/solicitacoes/:id_solicitacao', async (req, res) => {
  const { id_solicitacao } = req.params;
  const { status_solicitacao, resultado_processamento } = req.body;
  
  if (!status_solicitacao) {
    return res.status(400).json({ error: "Status da Solicitação é obrigatório." });
  }

  try {
    const sql = `
      UPDATE SOLICITACOES_LGPD
      SET STATUS_SOLICITACAO = ?, RESULTADO_PROCESSAMENTO = ?
      WHERE ID_SOLICITACAO = ?
    `;
    const result = await query(sql, [status_solicitacao, resultado_processamento || null, id_solicitacao]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Solicitação não encontrada." });
    }

    res.status(200).json({ 
      message: "Status da solicitação atualizado com sucesso.", 
      id: id_solicitacao,
      status: status_solicitacao
    });
  } catch (error) {
    console.error("Erro ao atualizar solicitação:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

app.listen(port, () => {
  console.log(`API de Solicitações rodando na porta ${port}`);
});