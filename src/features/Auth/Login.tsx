import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../api/auth.service';
import { Lock, Mail, ChevronRight } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.login(email, senha);
      navigate('/tutores'); // Redireciona após sucesso
    } catch (err) {
      setError('Credenciais inválidas ou erro no servidor.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black italic tracking-tighter uppercase">
            PET.<span className="text-blue-600">MANAGER</span>
          </h1>
          <p className="text-zinc-600 font-bold text-[10px] tracking-[0.4em] mt-2">SISTEMA DE GESTÃO PÚBLICA</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700 size-5" />
            <input 
              type="email"
              placeholder="E-MAIL"
              className="w-full pl-14 pr-6 py-5 bg-zinc-900/50 border border-zinc-800 rounded-2xl outline-none focus:border-blue-600 transition-all font-bold text-xs"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700 size-5" />
            <input 
              type="password"
              placeholder="SENHA"
              className="w-full pl-14 pr-6 py-5 bg-zinc-900/50 border border-zinc-800 rounded-2xl outline-none focus:border-blue-600 transition-all font-bold text-xs"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-[10px] font-black uppercase text-center">{error}</p>}

          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 group"
          >
            Acessar Sistema <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;