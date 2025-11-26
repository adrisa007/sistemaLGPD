// index.js - Ponto de entrada da aplicação
// Este arquivo garante que o servidor só inicie APÓS a conexão com o banco de dados ser estabelecida,
// evitando que o Cloud Run retorne erro antes da inicialização completa.

const app = require('./server'); // Importa a configuração do app Express
const { pool, testConnection } = require('./db'); // Importa o pool e o teste de conexão

const PORT = process.env.PORT || 8080;

let server; // Variável para a instância do servidor HTTP

// --- Função Assíncrona para iniciar a aplicação ---
const startServer = async () => {
    try {
        console.log('--- Iniciando API LGPD ---');
        
        // 1. CHAVE: TESTA a conexão com o banco de dados. 
        // Se a conexão falhar (por exemplo, credenciais erradas ou DB inacessível), 
        // o db.js chamará process.exit(1), e o container irá parar com o erro correto.
        await testConnection(); 
        
        // 2. Se o teste de conexão passou, inicia o servidor Express
        server = app.listen(PORT, '0.0.0.0', () => {
            console.log(`Servidor escutando na porta ${PORT}`);
            console.log('API Gateway LGPD está pronta para receber requisições!');
        });
        
        // Configura o tratamento de sinais de encerramento após o servidor iniciar
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    } catch (error) {
        // Esta captura de erro é principalmente para falhas de setup/importação.
        console.error('Erro fatal ao iniciar a aplicação:', error);
        process.exit(1);
    }
};

// --- Tratamento para encerramento gracioso (Graceful Shutdown) ---
const gracefulShutdown = (signal) => {
    console.log(`Sinal ${signal} recebido. Encerrando o servidor HTTP.`);
    
    // 1. Fecha o servidor HTTP para parar de aceitar novas requisições
    if (server) {
        server.close(() => {
            console.log('Servidor HTTP encerrado.');
            
            // 2. Fecha o pool de conexões do banco de dados
            if (pool) {
                pool.end(err => {
                    if (err) console.error('Erro ao fechar o pool de conexões do banco de dados:', err);
                    else console.log('Pool de conexões do banco de dados fechado.');
                    process.exit(err ? 1 : 0);
                });
            } else {
                 process.exit(0);
            }
        });
    } else {
        process.exit(0);
    }
};

// Inicia o processo de inicialização
startServer();
