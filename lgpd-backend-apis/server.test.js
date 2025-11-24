const request = require('supertest');

// Esta linha instrui o Jest a usar a versão simulada de 'db.js' na pasta __mocks__
jest.mock('./db');

const app = require('./server'); // Ajuste o caminho se necessário

describe('API Gateway Root', () => {

  it('deve responder com status 200 na rota raiz', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('API Gateway LGPD está funcionando!');
  });

});
