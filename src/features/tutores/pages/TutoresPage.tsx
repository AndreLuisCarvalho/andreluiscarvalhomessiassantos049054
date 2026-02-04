import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, User, Phone, MapPin, ChevronLeft, ChevronRight, Info } from 'lucide-react'; 
import { tutoresService } from '../tutores.service';

const TutoresPage: React.FC = () => {
  const [tutores, setTutores] = useState<any[]>([]);
  const [page, setPage] = useState(0); 
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true); // Começa como true para evitar flash de tela vazia
  const navigate = useNavigate();

  const fetchTutores = async () => {
    try {
      setLoading(true);
      const data = await tutoresService.list(page, searchTerm);
      
      // Verificação de segurança: A API deve seguir o Requisito 1 & 4
      if (data && data.content) {
        setTutores(data.content);
        setTotalPages(data.totalPages);
      } else if (Array.isArray(data)) {
        // Fallback caso a API retorne a lista direta sem paginação
        setTutores(data);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Erro ao buscar tutores:", error);
      setTutores([]); // Limpa para não travar a tela
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTutores();
  }, [page, searchTerm]);

  return (
    <div className="min-h-screen w-full bg-black text-white">
      <div className="p-6 max-w-[1600px] mx-auto w-full pb-20">
        
        {/* Header - Estilo Mato Grosso */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8 pt-12">
          <div>
            <h1 className="text-7xl font-black uppercase italic tracking-tighter leading-none">
              TUTORES <span className="text-blue-600">MT</span>
            </h1>
            <p className="text-zinc-600 font-bold uppercase text-[10px] tracking-[0.4em] mt-3">
              BASE DE DADOS DE PROPRIETÁRIOS
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative w-80 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-800 size-5" />
              <input 
                type="text"
                placeholder="BUSCAR POR NOME..."
                className="w-full pl-14 pr-6 py-5 bg-zinc-900/40 border border-zinc-800/50 rounded-2xl outline-none focus:border-blue-600 transition-all font-black text-[10px] tracking-widest uppercase"
                value={searchTerm}
                onChange={(e) => {setSearchTerm(e.target.value); setPage(0);}}
              />
            </div>
            <button 
              onClick={() => navigate('/tutores/novo')}
              className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl hover:border-blue-600 transition-all"
            >
              <Plus size={24} />
            </button>
          </div>
        </div>

        {/* Estado de Carregamento */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-zinc-500 font-black italic text-[10px] uppercase tracking-widest">Acessando Registro Público...</p>
          </div>
        ) : tutores.length === 0 ? (
          /* Estado Vazio */
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-zinc-900 rounded-[3rem]">
            <User size={48} className="text-zinc-800 mb-4" />
            <p className="text-zinc-500 font-black italic text-xl uppercase">Nenhum tutor encontrado</p>
          </div>
        ) : (
          /* Grid de Tutores */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {tutores.map((tutor) => (
              <div 
                key={tutor.id} 
                onClick={() => navigate(`/tutores/${tutor.id}`)}
                className="group cursor-pointer bg-[#0c0c0c] border border-zinc-900 rounded-[2.5rem] p-8 hover:border-blue-600/50 transition-all"
              >
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center text-blue-600 border border-zinc-800">
                    <User size={30} />
                  </div>
                  <div className="overflow-hidden">
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter truncate leading-tight group-hover:text-blue-500 transition-colors">
                      {tutor.nome || 'NOME INDISPONÍVEL'}
                    </h2>
                    <p className="text-zinc-700 text-[8px] font-black uppercase tracking-widest">REGISTRO ATIVO</p>
                  </div>
                </div>
                
                <div className="space-y-3 pt-6 border-t border-zinc-900/50">
                  <div className="flex items-center gap-3 text-zinc-400">
                    <Phone size={14} className="text-blue-600" />
                    <span className="text-xs font-bold">{tutor.telefone || 'SEM CONTATO'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-400">
                    <MapPin size={14} className="text-zinc-700" />
                    <span className="text-xs font-bold uppercase truncate">{tutor.endereco || 'CUIABÁ - MT'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Paginação */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 border-t border-zinc-900 pt-12">
            <button 
              disabled={page === 0}
              onClick={() => setPage(p => Math.max(0, p - 1))}
              className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl disabled:opacity-20 hover:border-blue-600 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-2 px-6">
              <span className="text-white font-black italic text-lg">{page + 1}</span>
              <span className="text-zinc-700 font-black text-[10px] uppercase tracking-widest">de {totalPages}</span>
            </div>
            <button 
              disabled={page + 1 >= totalPages}
              onClick={() => setPage(p => p + 1)}
              className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl disabled:opacity-20 hover:border-blue-600 transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutoresPage;