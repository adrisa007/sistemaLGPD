// api_uso_dados.js
const express = require('express');
const { query } = require('./db');
const app = express();
const axios = require('axios'); // NOVO: Para chamada assíncrona
app.use(express.json());

const port = process.env.PORT || 8080;

// Rota de saúde (Health Check)
app.get('/', (req, res) => {
  res.status(200).json({
    message: "API de Uso de Dados (Fase 2) - OK",
    service: "uso_dados"
  });
});

// ##################################################################
// Rotas para TITULARES_DADOS (Identificação do Titular) - Etapa 5
// ##################################################################

// POST /titulares: Cria um novo Titular
app.post('/titulares', async (req, res) => {
  const { id_entidade, cpf, nome } = req.body;
  
  if (!id_entidade || !cpf || !nome) {
    return res.status(400).json({ error: "ID da Entidade, CPF e Nome são obrigatórios." });
  }

  try {
    const sql = `
      INSERT INTO TITULARES_DADOS (ID_ENTIDADE, CPF, NOME)
      VALUES (?, ?, ?)
    `;
    const result = await query(sql, [id_entidade, cpf, nome]);
    
    res.status(201).json({ 
      message: "Titular cadastrado com sucesso.", 
      id: result.insertId 
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: "CPF já cadastrado." });
    }
    console.error("Erro ao cadastrar titular:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

// ##################################################################
// Rotas para USOS_POR_TITULAR (Registro do Ciclo de Vida do Dado) - Etapas 6 e 7
// ##################################################################

// GET /usos/:id_uso/check: Checagem do Acesso (Filtros 2 e 3) - Etapa 7
app.get('/usos/:id_uso/check', async (req, res) => {
  const { id_uso } = req.params;
  const { usuario_acessor_cpf } = req.query; // CPF do Operador/Prestador (Filtro Nível 2)

  if (!usuario_acessor_cpf) {
    return res.status(400).json({ error: "CPF do usuário acessor é obrigatório para a checagem." });
  }

  try {
    // 1. Checagem do Filtro Nível 2 (Autorização Formal - TC)
    const sqlFiltro2 = `
      SELECT T.STATUS_TC, T.DATA_VENCIMENTO_TC
      FROM TERMOS_CONFIDENCIALIDADE T
      JOIN CARGOS C ON T.CPF_USUARIO_EMITENTE = C.CPF_USUARIO
      WHERE C.CPF_USUARIO = ?
      ORDER BY T.DATA_VENCIMENTO_TC DESC
      LIMIT 1
    `;
    const tcResult = await query(sqlFiltro2, [usuario_acessor_cpf]);
    const tcStatus = tcResult.length > 0 ? tcResult[0].STATUS_TC : 'Não Aprovado';
    const tcVencimento = tcResult.length > 0 ? tcResult[0].DATA_VENCIMENTO_TC : null;

    if (tcStatus !== 'Aprovado') {
      return res.status(403).json({
        acesso_permitido: false,
        motivo: "Filtro Nível 2 (Autorização Formal) não aprovado para este usuário.",
        detalhes: { tcStatus, tcVencimento }
      });
    }

    // 2. Checagem do Filtro Nível 3 (Consentimento do Titular - STATUS_USO)
    const sqlFiltro3 = `
      SELECT 
        U.STATUS_USO, 
        U.DATA_DESCARTE,
        GROUP_CONCAT(FR.DESCRICAO_FINALIDADE) AS finalidades_uso,
        MAX(FR.DATA_MAX_VENCIMENTO) AS maior_data_max_vencimento
      FROM USOS_POR_TITULAR U
      JOIN USO_FINALIDADE_ASSOCIACAO UFA ON U.ID_USO = UFA.ID_USO
      JOIN FINALIDADES_REGISTRO FR ON UFA.ID_FINALIDADE = FR.ID_FINALIDADE
      WHERE U.ID_USO = ?
      GROUP BY U.ID_USO
    `;
    const usoResult = await query(sqlFiltro3, [id_uso]);

    if (usoResult.length === 0) {
      return res.status(404).json({ error: "Registro de Uso não encontrado." });
    }

    const usoData = usoResult[0];
    const consentimentoStatus = usoData.STATUS_USO;

    if (consentimentoStatus !== 'Ativo') {
      return res.status(403).json({
        acesso_permitido: false,
        motivo: "Filtro Nível 3 (Consentimento) revogado ou inativo.",
        detalhes: { consentimentoStatus, dataDescarte: usoData.DATA_DESCARTE }
      });
    }

    // 3. Acesso Permitido
    res.status(200).json({
      acesso_permitido: true,
      motivo: "Acesso permitido. Filtros Nível 2 e 3 aprovados.",
      detalhes: {
        tcStatus,
        tcVencimento,
        consentimentoStatus,
        dataDescarte: usoData.DATA_DESCARTE,
        finalidades: usoData.finalidades_uso.split(','),
        maiorDataMaxVencimento: usoData.maior_data_max_vencimento
      }
    });

    // 4. Log de Acesso (Etapa 8) - Chamada Assíncrona para a API de Auditoria
    // A URL da API de Auditoria deve ser injetada via variável de ambiente no Cloud Run
    const auditoriaUrl = process.env.API_AUDITORIA_URL;
    if (auditoriaUrl) {
      axios.post(`${auditoriaUrl}/log`, {
        id_uso: id_uso,
        usuario_acessor: usuario_acessor_cpf, // Usando o CPF do Operador/Prestador
        status_consentimento_momento: consentimentoStatus // 'Ativo'
      }).catch(logError => {
        // A falha no log não deve impedir o acesso, apenas registrar o erro
        console.error("Erro ao registrar log de acesso (assíncrono):", logError.message);
      });
    } else {
      console.warn("Variável de ambiente API_AUDITORIA_URL não configurada. Log de acesso desabilitado.");
    }

  } catch (error) {
    console.error("Erro na checagem de acesso:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

// POST /usos: Cria um novo Registro de Uso - Etapa 6
app.post('/usos', async (req, res) => {
  const { id_titular, id_local_arq, dono_temporario, finalidades } = req.body;
  
  if (!id_titular || !finalidades || finalidades.length === 0) {
    return res.status(400).json({ error: "ID do Titular e Finalidades são obrigatórios." });
  }

  const status_uso = 'Ativo';
  
  try {
    // 1. Inserir na USOS_POR_TITULAR
    const sqlUso = `
      INSERT INTO USOS_POR_TITULAR (ID_TITULAR, ID_LOCAL_ARQ, DONO_TEMPORARIO, STATUS_USO)
      VALUES (?, ?, ?, ?)
    `;
    const resultUso = await query(sqlUso, [id_titular, id_local_arq || null, dono_temporario || null, status_uso]);
    const id_uso = resultUso.insertId;

    // 2. Inserir na USO_FINALIDADE_ASSOCIACAO (N:M)
    const sqlAssociacao = `
      INSERT INTO USO_FINALIDADE_ASSOCIACAO (ID_USO, ID_FINALIDADE)
      VALUES ?
    `;
    const associacaoValues = finalidades.map(id_finalidade => [id_uso, id_finalidade]);
    await query(sqlAssociacao, [associacaoValues]);

    // Lógica 2 (Restrição de Prazo): Calcular DATA_DESCARTE com base na MAIOR DATA_MAX_VENCIMENTO das finalidades.
    const finalidadesPlaceholders = finalidades.map(() => '?').join(',');
    const sqlMaxDate = `
      SELECT MAX(DATA_MAX_VENCIMENTO) AS data_descarte
      FROM FINALIDADES_REGISTRO
      WHERE ID_FINALIDADE IN (${finalidadesPlaceholders})
    `;
    const [maxDateResult] = await query(sqlMaxDate, finalidades);
    const data_descarte = maxDateResult[0].data_descarte;

    // 3. Atualizar USOS_POR_TITULAR com a DATA_DESCARTE calculada
    const sqlUpdateUso = `
      UPDATE USOS_POR_TITULAR
      SET DATA_DESCARTE = ?
      WHERE ID_USO = ?
    `;
    await query(sqlUpdateUso, [data_descarte, id_uso]);

    res.status(201).json({ 
      message: "Registro de Uso criado com sucesso.", 
      id_uso: id_uso 
    });
  } catch (error) {
    console.error("Erro ao criar registro de uso:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

app.listen(port, () => {
  console.log(`API de Uso de Dados rodando na porta ${port}`);
});