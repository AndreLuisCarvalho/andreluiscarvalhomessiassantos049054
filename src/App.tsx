import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { Dog, Users, LogOut, PawPrint } from 'lucide-react';

// Substitua seus imports lazy por estes:
const LoginPage = lazy(() => import('./features/Auth/LoginPage'));
const PetsPage = lazy(() => import('./features/Pets/pages/PetsPage'));
const PetDetail = lazy(() => import('./features/Pets/PetDetail')); // Verifique se está na raiz de Pets ou em pages
const PetForm = lazy(() => import('./features/Pets/components/PetForm'));

// Atenção: Na imagem 719247, a pasta tutores está em minúsculo
const TutoresPage = lazy(() => import('./features/tutores/pages/TutoresPage')); 
const TutorDetail = lazy(() => import('./features/tutores/pages/TutorDetail'));
const TutorForm = lazy(() => import('./features/tutores//components/TutorForm'));

// Componente de Navegação com Proteção de Token
const Navbar = () => {
  const navigate = useNavigate();
  // Busca por ambas as chaves para evitar que a aba suma
  const token = localStorage.getItem('token') || localStorage.getItem('access_token');

  // Se não estiver logado, a Navbar não aparece
  if (!token) return null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  return (
    <nav className="bg-zinc-900 border-b border-zinc-800 p-4 mb-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-10">
          {/* Logo Estilizada conforme o Tema Premium */}
          <Link to="/pets" className="flex items-center gap-2 text-blue-600 font-black italic uppercase tracking-tighter text-2xl">
            <PawPrint size={32} /> PET.MANAGER
          </Link>
          
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
            <Link to="/pets" className="hover:text-white flex items-center gap-2 transition-all hover:scale-105 active:text-blue-500">
              <Dog size={18} /> Pets
            </Link>
            <Link to="/tutores" className="hover:text-white flex items-center gap-2 transition-all hover:scale-105 active:text-blue-500">
              <Users size={18} /> Tutores
            </Link>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-500 hover:bg-red-500/10 px-4 py-2 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest border border-transparent hover:border-red-500/20"
        >
          <LogOut size={18} /> Sair
        </button>
      </div>
    </nav>
  );
};

function App() {
  return (
    <BrowserRouter>
      {/* Container principal com o fundo preto do edital */}
      <div className="min-h-screen bg-black selection:bg-blue-500/30">
        <Navbar />
        
        {/* Suspense com Fallback Estilizado para o Lazy Loading */}
        <Suspense fallback={
          <div className="flex flex-col justify-center items-center h-[60vh]">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
            <span className="text-zinc-600 font-black text-[10px] uppercase tracking-[0.3em] animate-pulse">
              Carregando Módulo...
            </span>
          </div>
        }>
          <Routes>
            {/* Redirecionamento Inicial */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Módulo de Autenticação */}
            <Route path="/login" element={<LoginPage />} />

            {/* Módulo de Pets - Requisito 1, 2 e 3 */}
            <Route path="/pets" element={<PetsPage />} />
            <Route path="/pets/novo" element={<PetForm />} />
            <Route path="/pets/:id" element={<PetDetail />} />

            {/* Módulo de Tutores - Requisito 4 */}
            <Route path="/tutores" element={<TutoresPage />} />
            <Route path="/tutores/novo" element={<TutorForm />} />
            <Route path="/tutores/:id" element={<TutorDetail />} />
            
            {/* Rota de Erro/Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

export default App;