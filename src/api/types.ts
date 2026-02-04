// src/api/types.ts

/**
 * Interface para o objeto de foto retornado pela API
 */
export interface PetFoto {
  id: string;
  nome: string;
  contentType: string;
  url: string;
}

/**
 * Interface para a entidade Pet
 */
export interface Pet {
  id?: string;
  nome: string;
  especie: string;
  raca: string;
  idade: number;
  peso: number;
  observacoes?: string;
  foto?: PetFoto; 
  tutorId?: string;
  tutor?: Tutor; // Objeto tutor para listagens e detalhes
}

/**
 * Interface para a entidade Tutor
 */
export interface Tutor {
  id?: string;
  nome: string;
  email: string;
  telefone: string;
  endereco: string; // Adicionado para corrigir erro no PetDetail
  // Tutores também podem possuir foto de perfil no sistema
  foto?: PetFoto; 
  pets?: Pet[];
}

/**
 * Interface genérica para respostas paginadas da API
 * Resolve o erro de importação no pets.service.ts
 */
export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}