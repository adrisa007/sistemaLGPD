// api_governanca.js
const express = require('express');
const { pool } = require('./db'); // CORREÇÃO: Importar o 'pool'
const router = express.Router(); // Use o Router do Express

// Rota de saúde (Health Check)
router.get('/health', (req, res) => { // Mude a rota para não conflitar com a raiz
  res.status(200).json({
    message: "API de Governança (Fase 1) - OK",
    service: "governanca"
  });
});

// Rotas para ENTIDADES (Controladores)
router.post('/entidades', async (req, res) => {
  const { cnpj, razao_social, email_contato, endereco_completo } = req.body;
  
  if (!cnpj || !razao_social) {
    return res.status(400).json({ error: "CNPJ e Razão Social são obrigatórios." });
  }

  try {
    const sql = `
      INSERT INTO ENTIDADES (CNPJ_ENTIDADE, RAZAO_SOCIAL, EMAIL_CONTATO, ENDERECO_COMPLETO)
      VALUES (?, ?, ?, ?)
    `;
    // CORREÇÃO: Usar pool.execute()
    const [result] = await pool.execute(sql, [cnpj, razao_social, email_contato, endereco_completo]);
    
    res.status(201).json({ 
      message: "Controlador criado com sucesso.", 
      id: result.insertId 
    });
  } catch (error) {
    console.error("Erro ao criar entidade:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

// Rotas para CARGOS (Perfis de Acesso)
router.post('/cargos', async (req, res) => {
  const { email, id_entidade, cpf_usuario, senha_hash, cargo, status_ativo } = req.body;
  
  if (!email || !id_entidade || !cpf_usuario || !senha_hash || !cargo) {
    return res.status(400).json({ error: "Campos obrigatórios ausentes." });
  }

  try {
    const sql = `
      INSERT INTO CARGOS (EMAIL, ID_ENTIDADE, CPF_USUARIO, SENHA_HASH, CARGO, STATUS_ATIVO)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    // CORREÇÃO: Usar pool.execute()
    const [result] = await pool.execute(sql, [email, id_entidade, cpf_usuario, senha_hash, cargo, status_ativo || true]);
    
    res.status(201).json({ 
      message: "Cargo/Perfil criado com sucesso.", 
      id: result.insertId 
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: "CPF ou Email já cadastrado." });
    }
    console.error("Erro ao criar cargo:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

// Exporte apenas o roteador
module.exports = router;