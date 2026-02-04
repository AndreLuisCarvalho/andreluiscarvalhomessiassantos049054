import { api } from '../../api/api';
import { Tutor } from './tutores.models';

// Interface para a resposta paginada da API
interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export const tutoresService = {
  // ADICIONADO: Listagem com paginação e busca (Requisito 1 e 4)
  async list(page = 0, nome = ''): Promise<PaginatedResponse<Tutor>> {
    const { data } = await api.get<PaginatedResponse<Tutor>>('/v1/tutores', {
      params: { page, size: 10, nome }
    });
    return data;
  },

  async getById(id: string): Promise<Tutor> {
    const { data } = await api.get<Tutor>(`/v1/tutores/${id}`);
    return data;
  },

  async save(id: string | undefined, formData: Partial<Tutor>, foto: File | null): Promise<string | undefined> {
    let currentTutorId: string | undefined = id;

    if (id) {
      await api.put(`/v1/tutores/${id}`, formData);
    } else {
      const response = await api.post<Tutor>('/v1/tutores', formData);
      currentTutorId = response.data.id; 
    }

    // Upload de Foto: POST /v1/tutores/{id}/fotos
    if (foto && currentTutorId) {
      const imageFormData = new FormData();
      // Verifique se o backend espera 'foto' ou 'file' conforme o Requisito 4
      imageFormData.append('file', foto); 
      await api.post(`/v1/tutores/${currentTutorId}/fotos`, imageFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    
    return currentTutorId;
  },

  async linkPet(tutorId: string, petId: string): Promise<void> {
    await api.post(`/v1/tutores/${tutorId}/pets/${petId}`);
  },

  async unlinkPet(tutorId: string, petId: string): Promise<void> {
    await api.delete(`/v1/tutores/${tutorId}/pets/${petId}`);
  }
};