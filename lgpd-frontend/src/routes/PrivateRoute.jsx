// src/routes/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; 

/**
 * Componente que verifica se o usuário está autenticado e tem o cargo necessário.
 * @param {Array<string>} allowedRoles - Array de cargos permitidos (Ex: ['DPO', 'Root_Admin']).
 */
const PrivateRoute = ({ allowedRoles }) => {
  // 1. Obtém o estado de autenticação e cargo
  const { isAuthenticated, userCargo } = useAuth();

  // 2. Condição de Verificação
  
  // 2.1. Verifica se o usuário está logado E se o cargo dele está na lista de allowedRoles
  const canAccess = isAuthenticated && allowedRoles.includes(userCargo);
  
  // 3. Renderização
  
  if (canAccess) {
    // Renderiza o conteúdo da rota filha (a página protegida)
    return <Outlet />;
  } else if (isAuthenticated) {
    // Se estiver logado, mas não tiver o cargo necessário (Ex: Operador tentando acessar a tela Root)
    // Redireciona para uma página de Acesso Negado (403)
    return <Navigate to="/acesso-negado" replace />;
  } else {
    // Se não estiver logado, redireciona para a tela de Login
    return <Navigate to="/login" replace />;
  }
};

export default PrivateRoute;