//api_auth.js  
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

//  IMPORTANTE: 'db' deve ser a sua conexão de banco de dados (pool)
// Exemplo: Se o db.js exporta a função 'query' do pool, você usará a importação abaixo.
const { query } = require('./db'); 

//  ROTA DE LOGIN (/api/v1/auth/login) - IMPLEMENTAÇÃO TEMPORÁRIA COM SHA2 
router.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    // Garante que todas as variáveis de ambiente necessárias estejam carregadas
    if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET não está definido nas variáveis de ambiente.');
        return res.status(500).json({ message: 'Erro de configuração do servidor.' });
    }

    try {
        // 1. Encontra o usuário no banco de dados (tabela CARGOS)
        const rows = await query('SELECT ID_CARGO, EMAIL, SENHA_HASH, CARGO, ID_ENTIDADE, STATUS_ATIVO FROM CARGOS WHERE EMAIL = ?', [email]);
        const user = rows[0];

        if (!user || user.STATUS_ATIVO !== 1) {
            return res.status(401).json({ message: 'Credenciais inválidas ou usuário inativo.' });
        }
        
        // 2. COMPARAÇÃO TEMPORÁRIA: Gera o hash SHA2 da senha fornecida
        //  Nota: Assume que você usou SHA2('senha123', 256) para inserir no banco
        const hashRows = await query('SELECT SHA2(?, 256) AS input_hash', [senha]);
        const inputHash = hashRows[0].input_hash;

        // Compara o hash gerado com o hash armazenado na coluna SENHA_HASH
        const isPasswordValid = (inputHash === user.SENHA_HASH);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        // 3. Geração do Token JWT (JSON Web Token)
        const token = jwt.sign(
            { id: user.ID_CARGO, email: user.EMAIL, cargo: user.CARGO, entidade: user.ID_ENTIDADE },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // 4. Sucesso: Retorna o token e o cargo para o Frontend
        res.json({ 
            token, 
            cargo: user.CARGO,
            message: 'Login realizado com sucesso.'
        });

    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

module.exports = router;