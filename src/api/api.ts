import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://pet-manager-api.geia.vip',
});

// 1. Interceptor de REQUISIÇÃO: Envia o token em todas as chamadas
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 2. Interceptor de RESPOSTA: Gerencia erros globais e expiração
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se a API retornar 401, o token é inválido ou expirou
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Redireciona para o login apenas se não estiver na página de login
      if (!window.location.pathname.includes('/login') && window.location.pathname !== '/') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);