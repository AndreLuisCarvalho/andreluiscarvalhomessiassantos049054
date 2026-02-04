/**
 * Interface que representa o modelo de Pet da API
 */
export interface Pet {
  id?: string;             // Opcional para criação, obrigatório no retorno da API
  nome: string;           // Nome do animal
  especie: string;        // Ex: Cão, Gato, Coelho
  raca: string;           // Raça do animal
  idade: number;          // Idade em anos
  fotoUrl?: string;       // Caminho/ID da imagem retornado pela API
  tutorId?: string;       // ID do tutor vinculado (Requisito 4)
}

/**
 * Interface para respostas paginadas da API (Requisito 1)
 */
export interface PaginatedResponse<T> {
  content: T[];           // Lista de itens (ex: Pet ou Tutor)
  totalPages: number;     // Total de páginas para a paginação
  totalElements: number;  // Total de registros no banco
  size: number;           // Quantidade por página (deve ser 10 no edital)
  number: number;         // Página atual
}