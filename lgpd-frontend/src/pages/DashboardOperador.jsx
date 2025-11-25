// src/pages/DashboardOperador.jsx

import React from 'react';
import { useAuth } from '../contexts/AuthContext'; 

function DashboardOperador() {
  // Obtém informações do usuário e a função de logout
  const { userCargo, logout } = useAuth();

  const handleLogout = () => {
    logout();
    // Redireciona o usuário de volta para a tela de login após o logout
    // Em uma aplicação real, você usaria 'navigate('/login')' do React Router
    window.location.href = '/login'; 
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Painel do Operador de Dados</h1>
        <p style={styles.userInfo}>Usuário Logado: **{userCargo}**</p>
      </div>
      
      <div style={styles.content}>
        <h2>Módulo de Uso e Cadastro</h2>
        <p>Esta área é dedicada ao cadastro de novos Titulares e ao registro das finalidades de uso de dados.</p>
        
        <div style={styles.card}>
            <h3>Ações Rápidas:</h3>
            <ul>
                <li>Cadastrar Novo Titular de Dados</li>
                <li>Registrar Novo Uso/Consentimento</li>
                <li>Consultar Arquivo Físico</li>
            </ul>
        </div>
      </div>
      
      <button onClick={handleLogout} style={styles.logoutButton}>
        Sair do Sistema
      </button>
    </div>
  );
}

const styles = {
    container: {
        padding: '30px',
        maxWidth: '1200px',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif',
    },
    header: {
        borderBottom: '2px solid #ccc',
        paddingBottom: '15px',
        marginBottom: '20px',
    },
    title: {
        color: '#007bff',
    },
    userInfo: {
        fontSize: '14px',
        color: '#555',
    },
    content: {
        marginBottom: '40px',
    },
    card: {
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        borderLeft: '5px solid #28a745',
        marginTop: '20px',
    },
    logoutButton: {
        padding: '10px 20px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    }
};

export default DashboardOperador;