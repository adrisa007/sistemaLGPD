// db.test.js
// Testes unitários para o módulo db.js

// Mock do módulo mysql2/promise para simular o pool de conexões
const mockExecute = jest.fn();
const mockCreatePool = jest.fn(() => ({
  execute: mockExecute,
  // ...
}));

// Mock do módulo mysql2/promise
jest.mock('mysql2/promise', () => ({
  createPool: mockCreatePool,
}));

// Define as variáveis de ambiente necessárias para o db.js
process.env.DB_USER = 'test_user';
// ...

// Importa o módulo a ser testado (db.js)
const { query, pool } = require('./db');

describe('db.js - Módulo de Conexão com Cloud SQL', () => {

  beforeAll(() => {
    // Verifica se o pool foi criado com as configurações corretas (Unix Socket)
    expect(mockCreatePool).toHaveBeenCalledWith({
      user: 'test_user',
      password: 'test_password',
      database: 'test_db',
      socketPath: '/cloudsql/test-project:test-region:test-instance',
      // ...
    });
  });

  it('deve executar uma consulta SQL com valores e retornar os resultados', async () => {
    const mockResults = [{ id: 2, nome: 'Com Valores' }];
    mockExecute.mockResolvedValueOnce([mockResults, {}]);

    const sql = 'SELECT * FROM TESTE WHERE id = ?';
    const values = [2];
    const results = await query(sql, values);

    expect(results).toEqual(mockResults);
    expect(mockExecute).toHaveBeenCalledWith(sql, values);
  });

  it('deve lançar um erro se a execução da consulta falhar', async () => {
    const mockError = new Error('Erro de conexão com o banco de dados');
    mockExecute.mockRejectedValueOnce(mockError);

    await expect(query('SELECT * FROM ERRO')).rejects.toThrow('Erro de conexão com o banco de dados');
  });
});
