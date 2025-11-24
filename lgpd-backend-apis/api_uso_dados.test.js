// api_uso_dados.test.js
const request = require('supertest');
const express = require('express');

// Mock do módulo db para simular o banco de dados
const mockQuery = jest.fn();
jest.mock('./db', () => ({
  query: mockQuery,
}));

// Mock do axios para simular a chamada assíncrona à API de Auditoria
const mockAxiosPost = jest.fn();
jest.mock('axios', () => ({
  post: mockAxiosPost,
}));

// Simulação da aplicação (para fins de teste)
const createApp = () => {
  // ... (O código completo da api_uso_dados.js deve ser importado ou simulado aqui)
  // Para este guia, assumimos que o código completo da seção 1.1 está sendo testado.
  const app = express();
  app.use(express.json());
  
  // Simulação das rotas POST /usos e GET /usos/:id_uso/check
  // ... (Código simulado das rotas para teste)
  
  return app;
};

describe('API de Uso de Dados - POST /usos', () => {
  // ... (Testes para POST /usos)
});

describe('API de Uso de Dados - GET /usos/:id_uso/check', () => {
  // ... (Testes para GET /usos/:id_uso/check)
  
  it('deve permitir o acesso e chamar a API de Auditoria', async () => {
    // Mock para Filtro 2 (TC)
    mockQuery.mockResolvedValueOnce([{ STATUS_TC: 'Aprovado', DATA_VENCIMENTO_TC: '2025-12-31' }]) 
              // Mock para Filtro 3 (Uso)
              .mockResolvedValueOnce([{ STATUS_USO: 'Ativo' }]); 

    // Simulação da variável de ambiente
    process.env.API_AUDITORIA_URL = 'http://api-auditoria-test';

    await request(app )
      .get('/usos/5/check?usuario_acessor_cpf=12345678900')
      .expect(200);

    // Verifica se a chamada assíncrona foi feita
    expect(mockAxiosPost).toHaveBeenCalledTimes(1);
    expect(mockAxiosPost).toHaveBeenCalledWith('http://api-auditoria-test/log', {
      id_uso: '5',
      usuario_acessor: '12345678900',
      status_consentimento_momento: 'Ativo'
    } );
  });
});