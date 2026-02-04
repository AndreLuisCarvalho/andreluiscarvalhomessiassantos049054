import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Dog, Cat, Info, Rabbit, ChevronLeft, ChevronRight } from 'lucide-react'; 
import { petsService } from '../pets.service'; 
import { Pet } from '../pets.models'; // Certifique-se que este arquivo também tem o campo 'foto'

const PetsPage: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const navigate = useNavigate();

  const getPetIcon = (especie: string) => {
    const esp = especie?.toLowerCase() || '';
    if (esp.includes('cão') || esp.includes('cachorro')) return <Dog size={48} strokeWidth={1} />;
    if (esp.includes('gato')) return <Cat size={48} strokeWidth={1} />;
    return <Rabbit size={48} strokeWidth={1} />;
  };

  const fetchPets = async (currentPage: number, nameFilter: string) => {
    setLoading(true);
    try {
      const data = await petsService.list(currentPage, nameFilter);
      setPets(data.content);
      setTotalPages(data.totalPages);
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
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [page, searchTerm]);

  return (
    <div className="min-h-screen w-full bg-black text-zinc-50 font-sans selection:bg-blue-600/30">
      <div className="p-6 w-full max-w-[1600px] mx-auto pb-20">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8 pt-12">
          <div>
            <h1 className="text-7xl font-black uppercase italic tracking-tighter text-white leading-none">
              MEUS <span className="text-blue-600">PETS</span>
            </h1>
            <p className="text-zinc-600 font-bold uppercase text-[10px] tracking-[0.4em] mt-3 ml-1">
              REGISTRO PÚBLICO DE MATO GROSSO
            </p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-96 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-800 group-focus-within:text-blue-500 transition-colors size-5" />
              <input 
                type="text"
                placeholder="PROCURAR POR NOME..."
                className="w-full pl-14 pr-6 py-5 bg-zinc-900/40 border border-zinc-800/50 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-zinc-800 font-black text-[10px] uppercase tracking-widest"
                value={searchTerm}
                onChange={(e) => {setSearchTerm(e.target.value); setPage(0);}}
              />
            </div>
            <button 
              onClick={() => navigate('/pets/novo')}
              className="bg-zinc-900 border border-zinc-800 text-white p-5 rounded-2xl transition-all hover:border-blue-600 active:scale-95 group shadow-2xl"
            >
              <Plus size={24} className="group-hover:rotate-90 transition-transform duration-500" />
            </button>
          </div>
        </div>

        {/* Grid de Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
          {pets.map((pet) => (
            <div 
              key={pet.id} 
              onClick={() => navigate(`/pets/${pet.id}`)}
              className="group cursor-pointer bg-[#0c0c0c] border border-zinc-900 rounded-[2.5rem] overflow-hidden hover:border-blue-600/50 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col"
            >
              <div className="aspect-square bg-zinc-900 relative overflow-hidden m-2 rounded-[2rem]">
                {/* Uso de (pet as any) para calar o erro de 'foto' do TS temporariamente */}
                {(pet as any).foto?.url ? (
                  <img 
                    src={(pet as any).foto.url} 
                    alt={pet.nome}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-zinc-800 bg-zinc-950">
                    {getPetIcon(pet.especie)}
                  </div>
                )}
                <div className="absolute bottom-6 left-6 w-5 h-5 bg-blue-600 rounded-full border-4 border-black shadow-lg" />
              </div>

              <div className="p-8 pt-4 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-3xl font-black mb-1 truncate text-white group-hover:text-blue-500 transition-colors uppercase italic tracking-tighter">
                    {pet.nome}
                  </h2>
                  <p className="text-zinc-700 text-[10px] font-bold uppercase tracking-widest mb-8">
                    {pet.raca || pet.especie}
                  </p>
                </div>
                
                <div className="flex items-center justify-between pt-6 border-t border-zinc-900/50">
                  <div className="flex flex-col">
                    <span className="text-zinc-800 text-[8px] font-black uppercase tracking-[0.2em] mb-1">Idade</span>
                    <span className="text-zinc-100 font-black text-base italic">{pet.idade} ANOS</span>
                  </div>
                  <div className="bg-zinc-900 p-2.5 rounded-xl border border-zinc-800">
                    <Info size={16} className="text-zinc-700" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Paginação Estilizada - MOVIDA PARA FORA DO MAP */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-6 mt-16 pb-12">
            <button 
              disabled={page === 0}
              onClick={(e) => {
                e.stopPropagation();
                setPage(p => p - 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl disabled:opacity-20 hover:border-blue-600 transition-all group"
            >
              <ChevronLeft size={20} className="text-zinc-500 group-hover:text-white" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-zinc-700 font-black text-[10px] uppercase tracking-[0.3em]">Página</span>
              <span className="bg-blue-600/10 text-blue-500 px-3 py-1 rounded-lg font-black italic text-sm border border-blue-600/20">{page + 1}</span>
              <span className="text-zinc-700 font-black text-[10px] uppercase tracking-[0.3em]">de {totalPages}</span>
            </div>

            <button 
              disabled={page + 1 >= totalPages}
              onClick={(e) => {
                e.stopPropagation();
                setPage(p => p + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl disabled:opacity-20 hover:border-blue-600 transition-all group"
            >
              <ChevronRight size={20} className="text-zinc-500 group-hover:text-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PetsPage;