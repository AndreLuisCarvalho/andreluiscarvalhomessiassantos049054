// src/modules/Pets/PetDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, MapPin, Calendar, PawPrint } from 'lucide-react';
import { api } from '../../api/api';
import { Pet, Tutor } from '../../api/types';

const PetDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pet, setPet] = useState<Pet | null>(null);
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Busca o Pet
        const petRes = await api.get<Pet>(`/v1/pets/${id}`);
        const petData = petRes.data;
        setPet(petData);

        // 2. Lógica para buscar tutor (Objeto aninhado ou ID separado)
        if (petData.tutor) {
          setTutor(petData.tutor);
        } else if (petData.tutorId) {
          const tutorRes = await api.get<Tutor>(`/v1/tutores/${petData.tutorId}`);
          setTutor(tutorRes.data);
        }
      } catch (err) {
        console.error("Erro ao carregar detalhes", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-blue-500 font-black animate-pulse uppercase tracking-[0.3em]">
      Carregando Prontuário...
    </div>
  );
  
  if (!pet) return <div className="min-h-screen bg-black text-white p-10">Pet não encontrado.</div>;

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-20">
      <div className="max-w-4xl mx-auto">
        
        {/* Botão Voltar */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8 font-black text-[10px] uppercase tracking-widest">
          <ArrowLeft size={16} /> Voltar para a lista
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          
          {/* Lado Esquerdo: Imagem e Destaque */}
          <div className="space-y-6">
            <div className="aspect-square rounded-[3rem] overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl relative">
              {/* Ajustado para usar o objeto foto conforme types.ts */}
              {pet.foto?.url ? (
                <img 
                  src={pet.foto.url} 
                  className="w-full h-full object-cover" 
                  alt={pet.nome} 
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-800">
                  <PawPrint size={100} />
                </div>
              )}
            </div>
            
            <div className="bg-zinc-900/50 p-8 rounded-[2.5rem] border border-zinc-800/50 shadow-lg">
              <h1 className="text-6xl font-black italic uppercase tracking-tighter text-blue-600 mb-2 leading-none">
                {pet.nome}
              </h1>
              <p className="text-zinc-400 font-bold uppercase text-xs tracking-widest">
                {pet.especie} <span className="text-zinc-700 mx-2">•</span> {pet.raca || 'Sem Raça definida'}
              </p>
            </div>
          </div>

          {/* Lado Direito: Informações e Tutor */}
          <div className="space-y-8">
            
            {/* Detalhes Técnicos */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-900/30 p-6 rounded-3xl border border-zinc-800/30">
                <Calendar className="text-blue-500 mb-2" size={20} />
                <span className="block text-zinc-500 text-[10px] font-black uppercase tracking-widest">Idade</span>
                <span className="text-xl font-black italic">{pet.idade} Anos</span>
              </div>
              <div className="bg-zinc-900/30 p-6 rounded-3xl border border-zinc-800/30">
                <PawPrint className="text-blue-500 mb-2" size={20} />
                <span className="block text-zinc-500 text-[10px] font-black uppercase tracking-widest">Raça</span>
                <span className="text-xl font-black italic truncate block">{pet.raca || 'N/A'}</span>
              </div>
            </div>

            {/* Informações do Tutor */}
            <div className="bg-blue-600/10 border border-blue-500/20 p-8 rounded-[3rem]">
              <h3 className="flex items-center gap-2 text-blue-500 font-black uppercase text-xs tracking-[0.2em] mb-6">
                <User size={16} /> Dados do Tutor
              </h3>
              
              {tutor ? (
                <div className="space-y-4">
                  <div>
                    <span className="text-zinc-500 text-[8px] font-black uppercase tracking-widest">Nome Completo</span>
                    <p className="text-xl font-black italic text-zinc-200">{tutor.nome}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={16} className="text-blue-500" />
                    <span className="text-zinc-300 font-bold text-sm">{tutor.telefone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin size={16} className="text-blue-500" />
                    {/* Agora 'endereco' está mapeado no seu type */}
                    <span className="text-zinc-300 font-bold text-sm">{tutor.endereco}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 bg-black/20 rounded-2xl border border-dashed border-blue-500/10">
                  <p className="text-zinc-600 font-bold uppercase text-[10px] tracking-widest">Nenhum tutor vinculado</p>
                  <button onClick={() => navigate(`/tutores`)} className="mt-2 text-blue-500 text-[10px] font-black uppercase underline">Vincular agora</button>
                </div>
              )}
            </div>

            {/* Ações */}
            <button 
              onClick={() => navigate(`/pets/editar/${pet.id}`)}
              className="w-full py-5 bg-zinc-900 hover:bg-zinc-800 text-white font-black uppercase tracking-[0.2em] rounded-2xl transition-all border border-zinc-800"
            >
              Editar Prontuário
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetail;