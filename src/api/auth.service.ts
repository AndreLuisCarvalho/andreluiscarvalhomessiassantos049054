import { api } from './api';

export const authService = {
  async login(email: string, senha: string) {
    // Endpoint conforme Requisito 5
    const { data } = await api.post('/v1/auth/login', { email, senha });
    
    if (data.token) {
      localStorage.setItem('@PetManager:token', data.token);
      // Configura o token para as próximas chamadas de API
      api.defaults.headers.Authorization = `Bearer ${data.token}`;
    }
    
    return data;
  },

  logout() {
    localStorage.removeItem('@PetManager:token');
    delete api.defaults.headers.Authorization;
  }
};