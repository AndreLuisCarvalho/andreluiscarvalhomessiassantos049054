import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../api/api';
import { Camera, ArrowLeft, Save } from 'lucide-react';

const PetForm: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [foto, setFoto] = useState<File | null>(null);
  
  // Estados individuais para facilitar o controle
  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState('');
  const [raca, setRaca] = useState('');
  const [idade, setIdade] = useState('');

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    // 1. Pega o token que já sabemos que funciona (visto na listagem)
    const token = localStorage.getItem('token') || localStorage.getItem('access_token');

    const petData = {
      nome: nome,
      especie: especie,
      raca: raca,
      idade: Number(idade) // Garante que é número para não dar erro 400/401
    };

    // 2. Tente sem o /v1 primeiro se o erro persistir
    await api.post('/v1/pets', petData, {
      headers: {
        Authorization: `Bearer ${token}` // Força o envio do token real
      }
    });

    alert('Pet adicionado com sucesso!');
    navigate('/pets');
  } catch (err: any) {
    console.error("ERRO NO POST:", err.response?.status, err.response?.data);
    
    if (err.response?.status === 401) {
      // Em vez de dar alert de sessão expirada direto, verifique o console
      console.error("A API recusou o seu token para salvar. Verifique se a rota /v1/pets está correta.");
    } else {
      alert('Erro ao salvar pet. Verifique os dados no console.');
    }
  }
};
  return (
    <div className="max-w-2xl mx-auto p-6 min-h-screen text-white">
      <button onClick={() => navigate('/pets')} className="flex items-center gap-2 text-gray-500 hover:text-white mb-6">
        <ArrowLeft size={18} /> Voltar
      </button>

      <div className="bg-gray-800 rounded-[2.5rem] p-10 border border-gray-700">
        <h2 className="text-3xl font-black text-blue-500 uppercase italic mb-8">Novo Pet</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <input 
            required placeholder="Nome do Pet"
            className="w-full p-4 bg-gray-900 border border-gray-700 rounded-2xl"
            onChange={e => setNome(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-6">
            <input 
              required placeholder="Espécie"
              className="w-full p-4 bg-gray-900 border border-gray-700 rounded-2xl"
              onChange={e => setEspecie(e.target.value)}
            />
            <input 
              type="number" required placeholder="Idade"
              className="w-full p-4 bg-gray-900 border border-gray-700 rounded-2xl"
              onChange={e => setIdade(e.target.value)}
            />
          </div>

          <input 
            required placeholder="Raça"
            className="w-full p-4 bg-gray-900 border border-gray-700 rounded-2xl"
            onChange={e => setRaca(e.target.value)}
          />

          <div className="p-8 bg-gray-900 border-2 border-dashed border-gray-700 rounded-2xl text-center relative">
            <input 
              type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={e => setFoto(e.target.files ? e.target.files[0] : null)}
            />
            <Camera className="mx-auto mb-2 text-gray-600" size={32} />
            <p className="text-sm text-gray-400">{foto ? foto.name : "Selecionar Foto"}</p>
          </div>

          <button type="submit" disabled={loading} className="w-full py-5 bg-blue-600 rounded-2xl font-black uppercase">
            {loading ? "Salvando..." : "Salvar Pet"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PetForm;