// api_governanca.test.js
const request = require('supertest');
const app = require('./server');
const { pool } = require('./db');

// Informa ao Jest para usar a simulação (mock) do banco de dados
jest.mock('./db');

describe('API de Governança - Rota /governanca', () => {

  // Limpa os mocks antes de cada teste
  beforeEach(() => {
    pool.execute.mockClear();
  });

  describe('POST /entidades', () => {
    it('deve criar uma nova entidade e retornar status 201', async () => {
      // ARRANGE (Preparação)
      const novaEntidade = {
        cnpj: '12345678000199',
        razao_social: 'Empresa Teste SA',
        email_contato: 'contato@empresa.com',
        endereco_completo: 'Rua Teste, 123'
      };

      // Prepara o mock do banco para simular uma inserção bem-sucedida
      const mockInsertResult = { insertId: 5 };
      pool.execute.mockResolvedValue([mockInsertResult]);

      // ACT (Ação)
      const response = await request(app)
        .post('/governanca/entidades')
        .send(novaEntidade);

      // ASSERT (Verificação)
      expect(response.statusCode).toBe(201);
      expect(response.body.message).toBe('Controlador criado com sucesso.');
      expect(response.body.id).toBe(5);

      // Verifica se a função do banco de dados foi chamada corretamente
      expect(pool.execute).toHaveBeenCalledTimes(1);
      expect(pool.execute).toHaveBeenCalledWith(expect.any(String), Object.values(novaEntidade));
    });
  });

});