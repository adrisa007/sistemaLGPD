const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rota para a TELA 1: Tela de Login Root
router.post('/login', authController.loginRoot);

// [Adicionar aqui rotas para a Tela 2 (Gestão de Controladores) e Tela 3 (Cadastro DPO)]

module.exports = router;