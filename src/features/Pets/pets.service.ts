import { api } from '../../api/api';
import { Pet, PaginatedResponse } from '../../api/types';

export const petsService = {
  // Requisito 1: Listagem com paginação e filtro por nome
  async list(page: number, nome?: string): Promise<PaginatedResponse<Pet>> {
    const { data } = await api.get<PaginatedResponse<Pet>>('/v1/pets', {
      params: { 
        page, 
        size: 10, 
        nome: nome || undefined 
      }
    });
    return data;
  },

  // Requisito 2: Detalhes do Pet
  async getById(id: string): Promise<Pet> {
    const { data } = await api.get<Pet>(`/v1/pets/${id}`);
    return data;
  },

  // Requisito 2 e 3: Salvar dados e realizar Upload da Foto
  async save(id: string | undefined, formData: Partial<Pet>, foto: File | null): Promise<string | undefined> {
    let currentPetId = id;

    if (id) {
      // Atualização: PUT /v1/pets/{id}
      await api.put(`/v1/pets/${id}`, formData);
    } else {
      // Criação: POST /v1/pets
      const { data } = await api.post<Pet>('/v1/pets', formData);
      currentPetId = data.id;
    }

    // Requisito 3: Upload de Foto (Endpoint separado)
    if (foto && currentPetId) {
      const imageFormData = new FormData();
      
      // Ajuste crucial: O backend da geia.vip espera a chave 'foto' para pets
      imageFormData.append('foto', foto); 
      
      try {
        await api.post(`/v1/pets/${currentPetId}/fotos`, imageFormData, {
          headers: { 
            'Content-Type': 'multipart/form-data' 
          }
        });
      } catch (error) {
        console.error("Falha ao processar upload da foto:", error);
        // Opcional: deletar o pet se a foto for obrigatória ou apenas avisar
      }
    }

    return currentPetId;
  },

  /**
   * Helper para URL de Fotos
   * Retorna a URL completa para ser usada no src da tag <img>
   */
  getFotoUrl(id: string | undefined): string | undefined {
    if (!id) return undefined;
    
    // Concatena a URL base com o endpoint de fotos do pet específico
    return `https://pet-manager-api.geia.vip/v1/pets/${id}/fotos`;
  }
};