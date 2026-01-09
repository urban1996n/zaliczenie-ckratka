import { useState, useEffect } from 'react';
import { httpClient } from '../api/httpClient';
import type { Health } from '../types/Health';

export const useHealth = () => {
  const [health, setHealth] = useState<Health | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const data = await httpClient.get<Health>('/health');
        setHealth(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchHealth();
  }, []);

  return { health, loading, error };
};
