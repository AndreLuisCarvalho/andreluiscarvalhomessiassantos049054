import { useState } from 'react';
import { tutoresService } from './tutores.service';
import { Tutor } from './tutores.models';
import { useNavigate } from 'react-router-dom';

export const useTutoresFacade = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveTutor = async (id: string | undefined, formData: Partial<Tutor>, foto: File | null) => {
    setLoading(true);
    setError(null);
    try {
      // Chama o service que resolve o problema do tutorId
      await tutoresService.save(id, formData, foto);
      navigate('/tutores');
    } catch (err: any) {
      // Requisito 5: Gerenciar expiração (401)
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError("Falha ao processar operação.");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getTutor = async (id: string) => {
    try {
      return await tutoresService.getById(id);
    } catch (err) {
      setError("Erro ao carregar dados.");
      return null;
    }
  };

  return { saveTutor, getTutor, loading, error };
};