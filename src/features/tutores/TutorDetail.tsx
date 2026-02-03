import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../api/api';
import { Tutor, Pet } from '../../api/types';
import { User, Plus, Trash2, Dog } from 'lucide-react';

const TutorDetail: React.FC = () => {
  const { id } = useParams();
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [allPets, setAllPets] = useState<Pet[]>([]); // Para o select de vinculação
  const [selectedPetId, setSelectedPetId] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [resTutor, resPets] = await Promise.all([
        api.get<Tutor>(`/v1/tutores/${id}`),
        api.get<{ content: Pet[] }>('/v1/pets?size=100') // Busca pets para vincular
      ]);
      setTutor(resTutor.data);
      setAllPets(resPets.data.content);
    } catch (err) {
      console.error("Erro ao carregar dados", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [id]);

  const vincularPet = async () => {
    if (!selectedPetId) return;
    try {
      await api.post(`/v1/tutores/${id}/pets/${selectedPetId}`);
      alert("Pet vinculado!");
      loadData(); // Recarrega a lista
    } catch (err) {
      alert("Erro ao vincular pet.");
    }
  };

  const desvincularPet = async (petId: number) => {
    if (!window.confirm("Remover este pet do tutor?")) return;
    try {
      await api.delete(`/v1/tutores/${id}/pets/${petId}`);
      loadData();
    } catch (err) {
      alert("Erro ao desvincular.");
    }
  };

  if (loading) return <div className="p-10 text-white">Carregando...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto text-white">
      {/* Cabeçalho do Tutor */}
      <div className="bg-gray-800 p-8 rounded-[2rem] border border-gray-700 mb-8 flex items-center gap-6">
        <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center">
          <User size={48} />
        </div>
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">{tutor?.nome}</h1>
          <p className="text-gray-400">{tutor?.email} • {tutor?.telefone}</p>
        </div>
      </div>

      {/* Seção de Vínculo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Adicionar Novo Pet */}
        <div className="bg-gray-900 p-6 rounded-3xl border border-dashed border-gray-700">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Plus size={20} className="text-blue-500" /> Vincular Novo Pet
          </h2>
          <select 
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl mb-4 text-white"
            value={selectedPetId}
            onChange={(e) => setSelectedPetId(e.target.value)}
          >
            <option value="">Selecione um Pet...</option>
            {allPets.map(pet => (
              <option key={pet.id} value={pet.id}>{pet.nome} ({pet.especie})</option>
            ))}
          </select>
          <button 
            onClick={vincularPet}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all"
          >
            Confirmar Vínculo
          </button>
        </div>

        {/* Listagem de Pets Vinculados */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Dog size={20} className="text-green-500" /> Pets Sob Responsabilidade
          </h2>
          {tutor?.pets && tutor.pets.length > 0 ? (
            tutor.pets.map(pet => (
              <div key={pet.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-2xl border border-gray-700">
                <div>
                  <p className="font-bold">{pet.nome}</p>
                  <p className="text-xs text-gray-500 uppercase">{pet.especie}</p>
                </div>
                <button 
                  onClick={() => desvincularPet(pet.id!)}
                  className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-600 italic">Nenhum pet vinculado ainda.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorDetail;