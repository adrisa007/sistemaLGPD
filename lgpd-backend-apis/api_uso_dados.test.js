// api_uso_dados.test.js
const request = require('supertest');
const app = require('./server'); // 1. Importa a aplicação REAL
const { pool } = require('./db'); // 2. Importa o 'pool' do mock para podermos espioná-lo
const axios = require('axios'); // 3. Importa o axios para podermos espioná-lo

// 4. Diz ao Jest para usar os mocks. Para './db', ele usará a pasta __mocks__. Para 'axios', ele criará um mock automático.
jest.mock('./db');
jest.mock('axios');

describe('API de Uso de Dados - Rota /uso-dados', () => {

  // Limpa os mocks antes de cada teste para garantir que um teste não interfira no outro
  beforeEach(() => {
    pool.execute.mockClear();
    axios.post.mockClear();
  });

  describe('GET /usos/:id_uso/check', () => {
    it('deve permitir o acesso e chamar a API de Auditoria quando os filtros passam', async () => {
      // ARRANGE (Preparação)

      // Prepara o retorno do mock para a primeira chamada ao banco (Filtro 2 - TC)
      const mockTcResult = [{ STATUS_TC: 'Aprovado', DATA_VENCIMENTO_TC: '2025-12-31' }];
      
      // Prepara o retorno do mock para a segunda chamada ao banco (Filtro 3 - Uso)
      const mockUsoResult = [{ 
        STATUS_USO: 'Ativo', 
        DATA_DESCARTE: '2026-01-01',
        finalidades_uso: 'Finalidade A,Finalidade B' 
      }];

      // Configura o pool.execute para retornar os valores preparados na ordem em que for chamado
      pool.execute
        .mockResolvedValueOnce([mockTcResult])
        .mockResolvedValueOnce([mockUsoResult]);

      // Simula a variável de ambiente para a URL da API de Auditoria
      process.env.API_AUDITORIA_URL = 'http://api-auditoria-test';
      
      // Prepara o mock do axios para não fazer nada (apenas registrar a chamada)
      axios.post.mockResolvedValue({ data: {} });

      // ACT (Ação)
      const response = await request(app)
        .get('/uso-dados/usos/5/check?usuario_acessor_cpf=12345678900');

      // ASSERT (Verificação)
      expect(response.statusCode).toBe(200);
      expect(response.body.acesso_permitido).toBe(true);

      // Verifica se o banco de dados foi consultado 2 vezes
      expect(pool.execute).toHaveBeenCalledTimes(2);

      // Verifica se a chamada assíncrona para a API de auditoria foi feita corretamente
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith('http://api-auditoria-test/log', {
        id_uso: '5',
        usuario_acessor: '12345678900',
        status_consentimento_momento: 'Ativo'
      });
    });
  });
});