export interface Pet {
  id?: number;
  nome: string;
  especie: string;
  raca: string;
  idade: number;  
  tutorId?: number; 
  fotoUrl?: string;   
}

export interface Tutor {
  id?: number;
  nome: string;       
  telefone: string;   
  email: string;
  endereco?: string; 
  fotoUrl?: string;   
  pets?: Pet[];    
}

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}