// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Componentes
import Login from './pages/Login';
import DashboardDPO from './pages/DashboardDPO'; // Criar este componente
import DashboardOperador from './pages/DashboardOperador'; // Criar este componente
import AcessoNegado from './pages/AcessoNegado'; // Criar este componente
import PrivateRoute from './routes/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* 1. ROTA PÚBLICA (LOGIN) */}
        <Route path="/login" element={<Login />} />
        
        {/* Rota inicial que redireciona para o login */}
        <Route path="/" element={<Navigate to="/login" replace />} /> 

        {/* 2. ROTAS PROTEGIDAS (DPO) */}
        {/* O DPO pode acessar: DPO e Rotas compartilhadas (Ex: Operador, se necessário) */}
        <Route element={<PrivateRoute allowedRoles={['DPO', 'Root_Admin']} />}>
          <Route path="/dpo/dashboard" element={<DashboardDPO />} />
          <Route path="/dpo/auditoria" element={<DashboardDPO />} />
        </Route>

        {/* 3. ROTAS PROTEGIDAS (OPERADOR) */}
        <Route element={<PrivateRoute allowedRoles={['Operador', 'Root_Admin']} />}>
          <Route path="/operador/uso-dados" element={<DashboardOperador />} />
          <Route path="/operador/cadastro-titular" element={<DashboardOperador />} />
        </Route>
        
        {/* 4. ROTA DE ERRO E CATCH-ALL */}
        <Route path="/acesso-negado" element={<AcessoNegado />} />
        <Route path="*" element={<h1>404: Página Não Encontrada</h1>} />

      </Routes>
    </Router>
  );
}

export default App;