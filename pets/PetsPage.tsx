import React, { useEffect, useState } from 'react';
import { api } from '../src/api/api';
import { Pet, PaginatedResponse } from '../src/api/types';

const PetsPage = () => {
  const [pets, setPets] = useState<Pet[]>([]);

  useEffect(() => {
    api.get<PaginatedResponse<Pet>>('/pets').then(res => setPets(res.data.content));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lista de Pets</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pets.map(pet => (
          <div key={pet.id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <h3 className="font-semibold text-blue-600">{pet.nome}</h3>
            <p className="text-sm text-gray-600">{pet.especie} - {pet.raca}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PetsPage;