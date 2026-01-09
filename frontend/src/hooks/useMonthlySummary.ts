import { useState, useCallback } from 'react';
import { getMonthlySummary } from '../api/monthlySummary';
import type { MonthlySummary } from '../types/MonthlySummary';

export const useMonthlySummary = (year: number, month: number) => {
  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMonthlySummary(year, month);
      setSummary(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  return { summary, loading, error, fetchSummary };
};
