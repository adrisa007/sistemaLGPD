// src/App.jsx
import React from 'react';
// Importa BrowserRouter, Routes, Route e o componente Navigate (corrigindo o erro anterior)
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Componentes (pode ser necessário criar estes arquivos na pasta src/pages/)
import Login from './pages/Login';
import DashboardDPO from './pages/DashboardDPO'; 
import DashboardOperador from './pages/DashboardOperador'; 
import AcessoNegado from './pages/AcessoNegado'; 

// Componente de Rota Protegida (pode ser necessário criar este arquivo em src/routes/)
import PrivateRoute from './routes/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        
        {/* 1. ROTA PÚBLICA (LOGIN) */}
        <Route path="/login" element={<Login />} />
        
        {/* Rota raiz que redireciona automaticamente para o login */}
        <Route path="/" element={<Navigate to="/login" replace />} /> 

        {/* 2. ROTAS PROTEGIDAS (DPO) */}
        {/* Acesso permitido apenas para 'DPO' e 'Root_Admin' */}
        <Route element={<PrivateRoute allowedRoles={['DPO', 'Root_Admin']} />}>
          <Route path="/dpo/dashboard" element={<DashboardDPO />} />
          <Route path="/dpo/auditoria" element={<DashboardDPO />} />
          {/* Adicione outras rotas específicas do DPO aqui */}
        </Route>

        {/* 3. ROTAS PROTEGIDAS (OPERADOR) */}
        {/* Acesso permitido apenas para 'Operador' e 'Root_Admin' */}
        <Route element={<PrivateRoute allowedRoles={['Operador', 'Root_Admin']} />}>
          <Route path="/operador/uso-dados" element={<DashboardOperador />} />
          <Route path="/operador/cadastro-titular" element={<DashboardOperador />} />
          {/* Adicione outras rotas específicas do Operador aqui */}
        </Route>
        
        {/* 4. ROTA DE ERRO E CATCH-ALL */}
        <Route path="/acesso-negado" element={<AcessoNegado />} />
        {/* Rota Catch-all para qualquer URL não mapeada */}
        <Route path="*" element={
          <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold text-gray-700">404: Página Não Encontrada</h1>
          </div>
        } />

      </Routes>
    </Router>
  );
}

export default App;