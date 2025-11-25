import React from 'react';
import { useAuth } from '../contexts/AuthContext';

function DashboardDPO() {
  const { userCargo, logout } = useAuth();
  return (
    <div>
      <h2>Dashboard DPO (Área Segura)</h2>
      <p>Bem-vindo, {userCargo}. Aqui você verá Logs e Solicitações LGPD.</p>
      <button onClick={logout}>Sair</button>
    </div>
  );
}
export default DashboardDPO;