import React, { useEffect, useState } from 'react';
import { api } from '../../api/api';
import { Tutor, PaginatedResponse } from '../../api/types';

const TutoresPage: React.FC = () => {
  const [tutores, setTutores] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadTutores = async () => {
      try {
        setLoading(true);
        // Fazendo a requisição para o endpoint de tutores
        const response = await api.get<PaginatedResponse<Tutor>>('/tutores');
        setTutores(response.data.content);
      } catch (error) {
        console.error("Erro ao carregar tutores:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTutores();
  }, []);

  if (loading) {
    return <div className="p-10 text-center font-bold">Carregando tutores...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 border-b-4 border-green-500 pb-2">
          Gestão de Tutores
        </h1>
        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          Total: {tutores.length}
        </span>
      </header>

      {/* Grid Responsivo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutores.map((tutor) => (
          <div 
            key={tutor.id} 
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 border border-gray-100"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {tutor.nome.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{tutor.nome}</h3>
                <p className="text-sm text-gray-500">ID: #{tutor.id}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-semibold w-20">Email:</span>
                <span className="truncate">{tutor.email}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-semibold w-20">Telefone:</span>
                <span>{tutor.telefone}</span>
              </div>
            </div>

            <button className="mt-4 w-full py-2 bg-gray-50 hover:bg-green-50 text-green-600 font-medium rounded-lg transition-colors border border-gray-200">
              Ver Detalhes
            </button>
          </div>
        ))}
      </div>

      {tutores.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed">
          <p className="text-gray-500">Nenhum tutor encontrado.</p>
        </div>
      )}
    </div>
  );
};

export default TutoresPage;