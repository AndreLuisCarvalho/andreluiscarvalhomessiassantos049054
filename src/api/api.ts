import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://pet-manager-api.geia.vip',
  // Removido o Content-Type fixo daqui para o Axios gerenciar 
  // automaticamente, especialmente em uploads de fotos.
});

// Requisito 5: Injeta o Token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@PetManager:token');
  
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

// Requisito 5: Tratamento global de erros (401 - Não autorizado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se a API retornar 401, o token expirou ou é inválido
    if (error.response?.status === 401) {
      localStorage.removeItem('@PetManager:token');
      
      // Evita loops de redirecionamento se já estiver na página de login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);