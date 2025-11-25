// src/pages/AcessoNegado.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function AcessoNegado() {
    const { userCargo } = useAuth();
    
    // Define para onde o usuário será redirecionado se ele tentar sair desta página
    const dashboardPath = userCargo ? `/${userCargo.toLowerCase()}/dashboard` : '/login';

    return (
        <div style={styles.container}>
            <div style={styles.box}>
                <h1 style={styles.title}>403 - Acesso Negado</h1>
                <p style={styles.message}>
                    Você está logado como **{userCargo || 'USUÁRIO INTERNO'}**, mas não possui permissão para acessar esta página.
                </p>
                
                <button 
                    onClick={() => window.location.href = dashboardPath}
                    style={styles.button}
                >
                    Voltar para o Painel
                </button>
                
                <p style={styles.contact}>
                    Se isso for um erro, contate o Administrador Root.
                </p>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f7f7f7',
        textAlign: 'center',
    },
    box: {
        padding: '50px',
        borderRadius: '10px',
        backgroundColor: '#fff',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        borderTop: '5px solid #dc3545',
    },
    title: {
        fontSize: '36px',
        color: '#dc3545',
        marginBottom: '15px',
    },
    message: {
        fontSize: '18px',
        color: '#333',
        marginBottom: '30px',
    },
    button: {
        padding: '10px 25px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px',
        cursor: 'pointer',
    },
    contact: {
        marginTop: '20px',
        fontSize: '12px',
        color: '#777',
    }
};

export default AcessoNegado;