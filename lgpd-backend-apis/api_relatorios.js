// api_relatorios.js
const express = require('express');
const { pool } = require('./db'); // Importa o módulo de conexão
const router = express.Router();

// Rota de saúde (Health Check)
router.get('/health', (req, res) => {
  res.status(200).json({
    message: "API de Relatórios/Auditoria (Fase 4) - OK",
    service: "relatorios"
  });
});

// ##################################################################
// Rotas para LOG_ACESSO_DADOS (Auditoria)
// ##################################################################

// GET /auditoria/acessos: Lista logs de acesso com filtros
router.get('/auditoria/acessos', async (req, res) => {
  const { id_uso, usuario_acessor, data_inicio, data_fim } = req.query;
  
  let sql = `
    SELECT * FROM LOG_ACESSO_DADOS
    WHERE 1=1
  `;
  const params = [];

  if (id_uso) {
    sql += ` AND ID_USO = ?`;
    params.push(id_uso);
  }
  if (usuario_acessor) {
    sql += ` AND USUARIO_ACESSOR = ?`;
    params.push(usuario_acessor);
  }
  if (data_inicio) {
    sql += ` AND DATA_ACESSO >= ?`;
    params.push(data_inicio);
  }
  if (data_fim) {
    sql += ` AND DATA_ACESSO <= ?`;
    params.push(data_fim);
  }

  sql += ` ORDER BY DATA_ACESSO DESC`;

  try {
    const [logs] = await pool.execute(sql, params);
    res.status(200).json(logs);
  } catch (error) {
    console.error("Erro ao listar logs de acesso:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

// ##################################################################
// Rotas para REGISTRO_DESCARTE (Prova Final)
// ##################################################################

// POST /prova-final/descarte: Registra a prova de descarte
router.post('/prova-final/descarte', async (req, res) => {
  const { id_titular, id_uso, motivo_descarte, hash_prova } = req.body;
  
  if (!id_titular || !id_uso || !motivo_descarte || !hash_prova) {
    return res.status(400).json({ error: "Campos obrigatórios ausentes." });
  }

  try {
    const sql = `
      INSERT INTO REGISTRO_DESCARTE (ID_TITULAR, ID_USO, MOTIVO_DESCARTE, HASH_PROVA)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await pool.execute(sql, [id_titular, id_uso, motivo_descarte, hash_prova]);
    
    // TODO: A lógica de atualização do STATUS_USO para 'Descartado' na api_uso_dados.js deve ser implementada
    // por um processo assíncrono (ex: Cloud Function acionada por Pub/Sub) após o registro da prova.

    res.status(201).json({ 
      message: "Registro de Prova Final de Descarte criado com sucesso.", 
      id: result.insertId 
    });
  } catch (error) {
    console.error("Erro ao registrar prova de descarte:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

// GET /prova-final/descarte/:id_titular: Lista provas de descarte por titular
router.get('/prova-final/descarte/:id_titular', async (req, res) => {
  const { id_titular } = req.params;
  
  try {
    const sql = `
      SELECT * FROM REGISTRO_DESCARTE
      WHERE ID_TITULAR = ?
      ORDER BY DATA_REGISTRO DESC
    `;
    const [registros] = await pool.execute(sql, [id_titular]);
    
    res.status(200).json(registros);
  } catch (error) {
    console.error("Erro ao listar registros de descarte:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

module.exports = router;