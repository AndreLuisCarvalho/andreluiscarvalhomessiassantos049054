import axios from 'axios';

// Instância base com a URL da API do Estado
export const api = axios.create({
  baseURL: 'https://pet-manager-api.geia.vip',
});

// Interceptor para injetar o Token automaticamente (Requisito 5)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});