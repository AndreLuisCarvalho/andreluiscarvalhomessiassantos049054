// src/modules/Pets/PetsPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Dog, Cat, Info, Rabbit } from 'lucide-react'; 
import { api } from '../../api/api';
import { Pet, PaginatedResponse } from '../../api/types';

const PetsPage: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const navigate = useNavigate();

  // Função para renderizar ícone baseado na espécie (Diferencial de UI)
  const getPetIcon = (especie: string) => {
    const esp = especie?.toLowerCase();
    if (esp?.includes('cão') || esp?.includes('cachorro')) return <Dog size={48} strokeWidth={1} />;
    if (esp?.includes('gato')) return <Cat size={48} strokeWidth={1} />;
    return <Rabbit size={48} strokeWidth={1} />;
  };

  const fetchPets = async (currentPage: number, nameFilter: string) => {
    setLoading(true);
    try {
      // Requisito Específico 1: GET /v1/pets com paginação e busca
      const response = await api.get<PaginatedResponse<Pet>>(`/v1/pets`, {
        params: {
          page: currentPage,
          size: 10, // Requisito: 10 por página
          nome: nameFilter || undefined
        }
      });
      setPets(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error: any) {
      console.error("Erro ao buscar pets", error);
      if (error.response?.status === 401) navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPets(page, searchTerm);
    }, 500); // Debounce para evitar múltiplas requisições ao digitar
    return () => clearTimeout(delayDebounceFn);
  }, [page, searchTerm]);

  return (
    <div className="min-h-screen bg-black text-zinc-50 font-sans selection:bg-blue-500/30">
      <div className="p-6 max-w-7xl mx-auto pb-20">
        
        {/* Header - Alinhado com a identidade do Diário Oficial / Login */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8 pt-8">
          <div>
            <h1 className="text-6xl font-black uppercase italic tracking-tighter text-white leading-none">
              Meus <span className="text-blue-600">Pets</span>
            </h1>
            <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-2 ml-1">
              Registro Público de Mato Grosso
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors size-5" />
              <input 
                type="text"
                placeholder="PROCURAR POR NOME..."
                className="w-full pl-12 pr-4 py-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-zinc-700 font-bold text-xs uppercase tracking-widest"
                value={searchTerm}
                onChange={(e) => {setSearchTerm(e.target.value); setPage(0);}}
              />
            </div>
            <button 
              onClick={() => navigate('/pets/novo')}
              className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-2xl transition-all shadow-xl shadow-blue-900/40 group active:scale-95"
              title="Cadastrar Novo Pet"
            >
              <Plus size={28} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Listagem em Cards - Requisito Específico 1 */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-32">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
            <span className="text-zinc-600 font-black uppercase text-xs tracking-[0.3em] animate-pulse">Sincronizando Dados...</span>
          </div>
        ) : pets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pets.map((pet) => (
              <div 
                key={pet.id} 
                onClick={() => navigate(`/pets/${pet.id}`)}
                className="group cursor-pointer bg-zinc-900/30 border border-zinc-800/50 rounded-[2.5rem] overflow-hidden hover:border-blue-600 transition-all hover:bg-zinc-900/80 hover:-translate-y-2 shadow-2xl"
              >
                {/* Foto do Pet - Requisito: Exibir se existir */}
                <div className="aspect-square bg-zinc-950 relative overflow-hidden">
                  {pet.fotoUrl ? (
                    <img 
                      src={`https://pet-manager-api.geia.vip/v1/pets/fotos/${pet.fotoUrl}`} 
                      alt={pet.nome}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-zinc-800 bg-zinc-900/50">
                      {getPetIcon(pet.especie)}
                      <span className="text-[10px] font-black uppercase mt-2 tracking-widest opacity-50 italic">Sem Foto</span>
                    </div>
                  )}
                  
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-blue-600 text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-wider shadow-lg">
                      {pet.especie}
                    </span>
                  </div>
                </div>

                {/* Info Pet */}
                <div className="p-8">
                  <h2 className="text-2xl font-black mb-1 truncate text-white group-hover:text-blue-400 transition-colors uppercase italic tracking-tighter">
                    {pet.nome}
                  </h2>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-4">
                    {pet.raca || 'Raça Indefinida'}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
                    <div className="flex flex-col">
                      <span className="text-zinc-600 text-[8px] font-black uppercase tracking-widest leading-none">Idade</span>
                      <span className="text-zinc-200 font-black text-sm italic">{pet.idade} ANOS</span>
                    </div>
                    <Info size={18} className="text-zinc-700 group-hover:text-blue-500 transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-40 border-2 border-dashed border-zinc-800 rounded-[3rem]">
            <Dog size={64} className="mx-auto text-zinc-800 mb-4" />
            <h3 className="text-zinc-500 font-black uppercase tracking-widest">Nenhum pet encontrado</h3>
            <p className="text-zinc-700 text-xs uppercase mt-2">Tente ajustar o filtro de busca</p>
          </div>
        )}

        {/* Paginação - Requisito: 10 por página */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-6 mt-20">
            <button 
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-6 py-3 border border-zinc-800 rounded-2xl hover:bg-zinc-900 disabled:opacity-10 transition-all font-black text-[10px] uppercase tracking-[0.2em] text-zinc-400"
            >
              Anterior
            </button>
            
            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 transition-all duration-300 rounded-full ${page === i ? 'w-8 bg-blue-600' : 'w-2 bg-zinc-800'}`}
                />
              ))}
            </div>

            <button 
              onClick={() => setPage(p => p + 1)}
              disabled={page + 1 >= totalPages}
              className="px-6 py-3 border border-zinc-800 rounded-2xl hover:bg-zinc-900 disabled:opacity-10 transition-all font-black text-[10px] uppercase tracking-[0.2em] text-zinc-400"
            >
              Próxima
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PetsPage;