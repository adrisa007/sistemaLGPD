// src/contexts/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Criação do Contexto
const AuthContext = createContext();

// Função que será usada para consumir o contexto em qualquer componente
export const useAuth = () => {
  return useContext(AuthContext);
};

// 2. Provedor de Autenticação
export const AuthProvider = ({ children }) => {
  // Estado inicial lendo do localStorage para persistência
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || null);
  const [userCargo, setUserCargo] = useState(localStorage.getItem('userCargo') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));

  // 3. Efeito para Sincronizar o Estado com o LocalStorage
  useEffect(() => {
    // Quando o token mudar, atualiza o localStorage e o status de autenticação
    if (authToken) {
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('userCargo', userCargo);
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userCargo');
      setIsAuthenticated(false);
    }
  }, [authToken, userCargo]);

  // 4. Função de Login
  const login = (token, cargo) => {
    // Chamada após a API retornar sucesso (como fizemos na tela Login.jsx)
    setAuthToken(token);
    setUserCargo(cargo);
  };

  // 5. Função de Logout
  const logout = () => {
    setAuthToken(null);
    setUserCargo(null);
  };

  // Objeto de valor que será compartilhado na aplicação
  const value = {
    authToken,
    userCargo,
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};