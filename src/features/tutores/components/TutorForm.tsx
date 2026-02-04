import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Camera, User, Phone, MapPin } from 'lucide-react';
import { tutoresService } from '../tutores.service'; // VERIFIQUE ESTE CAMINHO

const TutorForm: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [foto, setFoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    endereco: '' // Requisito 4 pede endereço
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Chama o save enviando: id (undefined), dados e a foto
      await tutoresService.save(undefined, formData, foto);
      navigate('/tutores');
    } catch (error) {
      console.error("Erro ao salvar tutor", error);
      alert("Erro ao salvar. Verifique se a API está rodando em /v1/tutores");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate('/tutores')} className="flex items-center gap-2 text-zinc-600 hover:text-white mb-10 transition-colors">
          <ArrowLeft size={18} /> <span className="text-[10px] font-black uppercase tracking-[0.2em]">Cancelar Registro</span>
        </button>

        <form onSubmit={handleSubmit} className="bg-[#0c0c0c] border border-zinc-900 rounded-[3rem] p-12 shadow-2xl">
          <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-12">
            NOVO <span className="text-blue-600">TUTOR</span>
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Foto do Tutor - Requisito 4 */}
            <div className="flex flex-col items-center justify-center gap-4 bg-zinc-900/30 border-2 border-dashed border-zinc-800 rounded-[2rem] p-8 group hover:border-blue-600/50 transition-all cursor-pointer"
                 onClick={() => fileInputRef.current?.click()}>
              {preview ? (
                <img src={preview} className="w-32 h-32 rounded-2xl object-cover border-2 border-blue-600" alt="Preview" />
              ) : (
                <div className="w-20 h-20 bg-zinc-900 rounded-2xl flex items-center justify-center text-zinc-700 group-hover:text-blue-600">
                  <Camera size={32} />
                </div>
              )}
              <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Upload de Foto</span>
              <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*" />
            </div>

            {/* Campos de Texto */}
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-700 ml-1"><User size={12}/> Nome Completo</label>
                <input required className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-2xl focus:border-blue-600 outline-none transition-all"
                       value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value.toUpperCase()})} />
              </div>

              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-700 ml-1"><Phone size={12}/> Contato</label>
                <input required className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-2xl focus:border-blue-600 outline-none transition-all"
                       placeholder="(65) 99999-9999" value={formData.telefone} onChange={e => setFormData({...formData, telefone: e.target.value})} />
              </div>
            </div>

            {/* Endereço - Requisito 4 */}
            <div className="md:col-span-2 flex flex-col gap-2">
              <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-700 ml-1"><MapPin size={12}/> Endereço Completo</label>
              <input required className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-2xl focus:border-blue-600 outline-none transition-all"
                     value={formData.endereco} onChange={e => setFormData({...formData, endereco: e.target.value.toUpperCase()})} />
            </div>
          </div>

          <button disabled={loading} type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-6 rounded-2xl flex items-center justify-center gap-3 transition-all mt-12 shadow-lg shadow-blue-600/20">
            <Save size={20} />
            <span className="font-black uppercase tracking-widest text-sm">{loading ? 'SALVANDO...' : 'CONFIRMAR REGISTRO'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default TutorForm;