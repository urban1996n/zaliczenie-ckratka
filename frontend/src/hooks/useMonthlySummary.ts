import { useState, useCallback, useMemo } from 'react';
import { getMonthlySummary } from '../api/monthlySummary';
import type { MonthlySummary } from '../types/MonthlySummary';
import { useHttpClient } from '../context/HttpClientContext.tsx';

export const useMonthlySummary = (year: number, month: number) => {
  const httpClient = useHttpClient();
  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const summariedMonth = useMemo(() => new Date(year, month, 1), [year, month]);
  const nextMonth = useMemo(() => new Date(year, month + 1, -1), [year, month]);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMonthlySummary(httpClient, summariedMonth, nextMonth);
      setSummary(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  return { summary, loading, error, fetchSummary };
};
