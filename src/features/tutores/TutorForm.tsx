import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import InputMask from 'react-input-mask';
import { UserPlus, Camera, MapPin, Mail, ArrowLeft, Save } from 'lucide-react';
import { api } from '../../api/api';
import { Tutor } from '../../api/types';

const TutorForm: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Tipagem explícita conforme a referência
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [foto, setFoto] = useState<File | null>(null);
  const [formData, setFormData] = useState<Partial<Tutor>>({
    nome: '',
    telefone: '',
    email: '',
    endereco: ''
  });

  useEffect(() => {
    if (id) {
      api.get<Tutor>(`/v1/tutores/${id}`)
        .then(res => setFormData(res.data))
        .catch(err => console.error("Erro ao carregar tutor", err));
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // CORREÇÃO DO ERRO TS: Variável mutável para capturar o ID da resposta
      let currentTutorId: string | undefined = id;

      if (id) {
        // Modo Edição
        await api.put(`/v1/tutores/${id}`, formData);
      } else {
        // Modo Criação - Extraindo o ID do objeto de resposta
        const response = await api.post<Tutor>('/v1/tutores', formData);
        currentTutorId = response.data.id;
      }

      // Upload da Foto utilizando o ID capturado
      if (foto && currentTutorId) {
        const imageFormData = new FormData();
        imageFormData.append('foto', foto);
        
        await api.post(`/v1/tutores/${currentTutorId}/fotos`, imageFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      navigate('/tutores');
    } catch (error: any) {
      // Trata o erro 401 que apareceu no seu print
      if (error.response?.status === 401) {
        alert("Sua sessão expirou. Por favor, faça login novamente.");
        navigate('/login');
      } else {
        console.error("Erro ao salvar tutor:", error);
        alert('Erro ao salvar tutor. Verifique os campos.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate('/tutores')} className="flex items-center gap-2 text-zinc-500 hover:text-white mb-8 font-black text-[10px] uppercase tracking-widest transition-colors">
          <ArrowLeft size={16} /> Voltar para a lista
        </button>

        <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-sm">
          <div className="flex items-center gap-6 mb-12">
            <div className="p-5 bg-blue-600 rounded-[2rem] shadow-xl shadow-blue-900/20">
              <UserPlus size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black uppercase italic tracking-tighter">
                {id ? 'Editar' : 'Novo'} <span className="text-blue-600">Tutor</span>
              </h1>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">Cadastro Governamental</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-zinc-500 ml-2 tracking-widest">Nome Completo</label>
                <input 
                  required
                  value={formData.nome}
                  className="w-full p-4 bg-zinc-950 border border-zinc-800 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-zinc-800"
                  placeholder="Nome do Tutor"
                  onChange={e => setFormData({...formData, nome: e.target.value})}
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-blue-400 ml-2 tracking-widest">Telefone (WhatsApp)</label>
                <InputMask 
                  mask="(99) 99999-9999"
                  required
                  value={formData.telefone}
                  className="w-full p-4 bg-zinc-950 border border-zinc-800 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                  placeholder="(00) 00000-0000"
                  onChange={(e: any) => setFormData({...formData, telefone: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-zinc-500 ml-2 tracking-widest">E-mail de Contato</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input 
                  type="email"
                  required
                  value={formData.email}
                  className="w-full pl-12 pr-4 py-4 bg-zinc-950 border border-zinc-800 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                  placeholder="contato@exemplo.com"
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-green-500 ml-2 tracking-widest">Endereço Residencial</label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input 
                  required
                  value={formData.endereco}
                  className="w-full pl-12 pr-4 py-4 bg-zinc-950 border border-zinc-800 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                  placeholder="Rua, Número, Bairro, Cidade"
                  onChange={e => setFormData({...formData, endereco: e.target.value})}
                />
              </div>
            </div>

            <div className="p-8 bg-zinc-950 border-2 border-dashed border-zinc-800 rounded-[2.5rem] text-center hover:border-blue-600/50 transition-colors group">
              <Camera className="mx-auto mb-2 text-zinc-800 group-hover:text-blue-500 transition-colors" size={40} />
              <p className="text-[10px] font-black uppercase text-zinc-600 tracking-widest mb-4">Selecione a foto do tutor</p>
              <input 
                type="file"
                accept="image/*"
                className="block w-full text-xs text-zinc-500 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:bg-zinc-800 file:text-zinc-300 file:font-black file:uppercase file:text-[10px] hover:file:bg-blue-600 hover:file:text-white cursor-pointer transition-all"
                onChange={e => setFoto(e.target.files ? e.target.files[0] : null)}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-6 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-[0.3em] text-xs rounded-[2rem] transition-all flex items-center justify-center gap-3 shadow-2xl shadow-blue-900/40"
            >
              {loading ? 'Salvando...' : id ? 'Salvar Alterações' : 'Finalizar Registro'}
              <Save size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TutorForm;