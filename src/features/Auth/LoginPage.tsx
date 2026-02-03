import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, AlertCircle } from 'lucide-react';
import { api } from '../../api/api';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/autenticacao/login', {
        username,
        password,
      });

      const { access_token, refresh_token } = response.data;

      if (!access_token) {
        throw new Error('Token não retornado');
      }

      // Salva tokens
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);

      // Header global
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      navigate('/pets');
    } catch (err) {
      setError('Credenciais inválidas. Usuário ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6">
      <div className="w-full max-w-md bg-gray-900 p-10 rounded-[3rem] border border-gray-800 shadow-2xl">
        <div className="text-center mb-10">
          <div className="inline-block p-4 bg-blue-600 rounded-3xl mb-4">
            <LogIn size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">
            Pet Manager
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-900/50 rounded-2xl text-red-500 text-sm font-bold flex items-center gap-2">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-[10px] font-black text-gray-500 uppercase ml-2">
              Usuário
            </label>
            <input
              className="w-full p-4 bg-gray-800 border border-gray-700 rounded-2xl text-white"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase ml-2">
              Senha
            </label>
            <input
              type="password"
              className="w-full p-4 bg-gray-800 border border-gray-700 rounded-2xl text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest rounded-2xl disabled:opacity-50"
          >
            {loading ? 'Autenticando...' : 'Entrar como Admin'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
