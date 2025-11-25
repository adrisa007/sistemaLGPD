import React, { useState } from 'react';
import axios from 'axios'; 
import { useAuth } from '../contexts/AuthContext'; // 🔑 Importa o hook de autenticação

// Constante da URL da API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Login() {
  // 1. CHAMA O CONTEXTO: Obtém a função login do AuthContext
  const { login } = useAuth(); 
  
  // 2. ESTADOS DO COMPONENTE
  const [credentials, setCredentials] = useState({
    email: '',
    senha: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 3. FUNÇÕES DE MANIPULAÇÃO
  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 3.1. Chamada à API de Login
      const response = await axios.post(`${API_BASE_URL}/api/v1/auth/login`, credentials);
      
      const { token, cargo } = response.data;
      
      // 3.2. AÇÃO DE SUCESSO: Chama a função 'login' do AuthContext
      // Isso armazena o token/cargo no estado global e no localStorage
      login(token, cargo); 
      
      alert(`Login bem-sucedido! Cargo: ${cargo}`);
      // Implementação futura: Redirecionamento via React Router
      
    } catch (err) {
      // 3.3. Ação de Erro
      const errorMessage = err.response?.data?.message || 'Erro de conexão ou credenciais inválidas.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // 4. RENDERIZAÇÃO DO COMPONENTE (JSX)
  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <h2 style={styles.title}>🔒 Acesso ao Sistema LGPD</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          
          {/* Campo Email */}
          <input
            type="email"
            name="email"
            placeholder="E-mail (DPO / Operador)"
            value={credentials.email}
            onChange={handleChange}
            required
            style={styles.input}
          />

          {/* Campo Senha */}
          <input
            type="password"
            name="senha"
            placeholder="Senha"
            value={credentials.senha}
            onChange={handleChange}
            required
            style={styles.input}
          />
          
          {/* Mensagem de Erro */}
          {error && <p style={styles.error}>{error}</p>}

          {/* Botão de Login */}
          <button type="submit" disabled={isLoading} style={styles.button}>
            {isLoading ? 'Acessando...' : 'Fazer Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

// 5. ESTILOS BÁSICOS (Mantidos para fins de organização)
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f4f7f9',
    },
    loginBox: {
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff',
        width: '350px',
        textAlign: 'center',
    },
    title: {
        marginBottom: '25px',
        color: '#0056b3',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    input: {
        padding: '12px',
        marginBottom: '15px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '16px',
    },
    button: {
        padding: '12px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    error: {
        color: 'red',
        marginBottom: '10px',
        fontSize: '14px',
    }
};

export default Login;