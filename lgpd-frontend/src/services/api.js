import axios from 'axios';

// Pega a URL base do seu arquivo .env
const API_URL = import.meta.env.VITE_API_BASE_URL; 

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const loginDPO = async (credentials) => {
  const response = await api.post('/api/v1/auth/login', credentials);
  return response.data;
};

// ... outros serviços

export default api;