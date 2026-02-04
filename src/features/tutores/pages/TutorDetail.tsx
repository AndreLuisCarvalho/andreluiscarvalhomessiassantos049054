import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Plus, Trash2, Dog, ArrowLeft, Link as LinkIcon } from 'lucide-react';
import { tutoresService } from '../tutores.service'; // Usando o service ajustado
import { api } from '../../../api/api';
import { Tutor, Pet } from '../../../api/types';

const TutorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Tipagem explícita para evitar erros
  const navigate = useNavigate();
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [allPets, setAllPets] = useState<Pet[]>([]);
  const [selectedPetId, setSelectedPetId] = useState('');
  const [loading, setLoading] = useState(true);

const loadData = async () => {
  if (!id) return;
  try {
    setLoading(true);
    
    // Note que resPets agora captura o objeto de resposta completo do Axios
    const [tutorData, resPets] = await Promise.all([
      tutoresService.getById(id),
      api.get<{ content: Pet[] }>('/v1/pets?size=100')
    ]);

    // tutorData já é o objeto Tutor retornado pelo service
    setTutor(tutorData); 
    
    // resPets.data é necessário aqui porque usamos api.get direto
    setAllPets(resPets.data.content); 
    
  } catch (err) {
    console.error("Erro ao carregar dados", err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => { loadData(); }, [id]);

  const handleVincular = async () => {
    if (!selectedPetId || !id) return;
    try {
      // Requisito 4: POST /v1/tutores/{id}/pets/{petId}
      await tutoresService.linkPet(id, selectedPetId);
      setSelectedPetId('');
      loadData();
    } catch (err) {
      alert("Erro ao vincular pet.");
    }
  };

  const handleDesvincular = async (petId: string) => {
    if (!id || !window.confirm("Remover este pet da responsabilidade do tutor?")) return;
    try {
      // Requisito 4: DELETE /v1/tutores/{id}/pets/{petId}
      await tutoresService.unlinkPet(id, petId);
      loadData();
    } catch (err) {
      alert("Erro ao desvincular.");
    }
  };

  if (loading) return <div className="p-10 text-zinc-500 font-black uppercase tracking-widest animate-pulse">Sincronizando dados...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate('/tutores')} className="flex items-center gap-2 text-zinc-500 mb-10 font-black text-[10px] uppercase tracking-widest hover:text-white transition-all">
          <ArrowLeft size={16} /> Voltar para a Gestão
        </button>

        {/* Perfil do Tutor - Design Refinado */}
        <div className="bg-zinc-900/40 border border-zinc-800 p-8 md:p-12 rounded-[3rem] mb-12 flex flex-col md:flex-row items-center gap-10">
          <div className="relative">
            <div className="w-32 h-32 bg-blue-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-blue-900/20">
              <User size={56} className="text-white" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-black" title="Tutor Ativo" />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <p className="text-blue-500 font-black text-[10px] uppercase tracking-[0.3em] mb-2">Tutor Responsável</p>
            <h1 className="text-5xl font-black uppercase italic tracking-tighter mb-4 leading-none">{tutor?.nome}</h1>
            <div className="flex flex-wrap gap-6 justify-center md:justify-start text-zinc-500 text-[11px] font-bold uppercase tracking-wider">
              <span className="bg-zinc-950 px-4 py-2 rounded-full border border-zinc-800">{tutor?.email}</span>
              <span className="bg-zinc-950 px-4 py-2 rounded-full border border-zinc-800">{tutor?.telefone}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Seção de Vínculo (Lado Esquerdo) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-zinc-900/60 border-2 border-dashed border-zinc-800 p-8 rounded-[2.5rem]">
              <h2 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-3 text-zinc-400">
                <LinkIcon size={18} className="text-blue-500" /> Novo Vínculo
              </h2>
              
              <select 
                className="w-full p-5 bg-zinc-950 border border-zinc-800 rounded-2xl mb-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                value={selectedPetId}
                onChange={(e) => setSelectedPetId(e.target.value)}
              >
                <option value="">Selecione um Pet do sistema...</option>
                {allPets.map(pet => (
                  <option key={pet.id} value={pet.id}>{pet.nome} ({pet.especie})</option>
                ))}
              </select>

              <button 
                onClick={handleVincular}
                disabled={!selectedPetId}
                className="w-full py-5 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:hover:bg-blue-600 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Confirmar Associação
              </button>
            </div>
          </div>

          {/* Listagem de Pets (Lado Direito) */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-sm font-black uppercase tracking-widest px-2 flex items-center gap-3 text-zinc-400">
              <Dog size={18} className="text-green-500" /> Pets Sob Responsabilidade
            </h2>
            
            <div className="space-y-4">
              {tutor?.pets && tutor.pets.length > 0 ? (
                tutor.pets.map(pet => (
                  <div key={pet.id} className="group flex items-center justify-between p-6 bg-zinc-900/40 border border-zinc-800 rounded-3xl hover:border-zinc-600 transition-all">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-zinc-950 rounded-2xl flex items-center justify-center border border-zinc-800 group-hover:border-blue-500/50 transition-colors">
                        <Dog size={24} className="text-zinc-700 group-hover:text-blue-500" />
                      </div>
                      <div>
                        <p className="font-black uppercase italic tracking-tight text-lg">{pet.nome}</p>
                        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{pet.especie} • {pet.raca || 'S/R'}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDesvincular(String(pet.id))}
                      className="p-4 text-zinc-700 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
                      title="Remover Vínculo"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center border-2 border-dashed border-zinc-900 rounded-[3rem]">
                   <p className="text-zinc-700 font-black uppercase text-[10px] tracking-[0.3em]">Nenhum animal vinculado ao prontuário</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorDetail;