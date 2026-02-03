import { api } from './api';

export const login = async (email: string, senha: string) => {
  const { data } = await api.post('/autenticacao/login', { email, senha });
  localStorage.setItem('token', data.token); // Salva o JWT
  return data;
};

// Interceptor para enviar o token automaticamente em toda requisição
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});