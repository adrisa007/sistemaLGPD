const { query } = require('../config/db');
const bcrypt = require('bcrypt'); // Necessário para SENHA_HASH

/**
 * Lógica de Login para a TELA 1: Tela de Login Root.
 */
exports.loginRoot = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Busca o usuário pelo email
        const userResult = await query(
            'SELECT * FROM CARGOS WHERE email = $1',
            [email]
        );

        if (userResult.rows.length === 0) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }

        const user = userResult.rows[0];

        // 2. Verifica a senha (SENHA_HASH)
        // const isPasswordValid = await bcrypt.compare(password, user.senha_hash);
        // Usaremos uma comparação simples para o escopo do projeto inicial
        const isPasswordValid = (password === user.senha_hash);


        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }

        // 3. Verifica o Filtro de Cargo (Root_Admin)
        if (user.cargo !== 'Root_Admin') {
            return res.status(403).json({ error: 'Acesso negado. Usuário não é Root_Admin.' });
        }

        // Sucesso
        res.status(200).json({ 
            message: 'Login Root bem-sucedido.', 
            userId: user.email,
            cargo: user.cargo
        });

    } catch (err) {
        console.error('Erro no login Root:', err);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
};