import type { FC } from 'react';
import { useEffect } from 'react';
import { useMonthlySummary } from '../../hooks/useMonthlySummary';
import { DashboardView } from './DashboardView';

export const Dashboard: FC = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const { summary, loading, error, fetchSummary } = useMonthlySummary(year, month);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return <DashboardView summary={summary} loading={loading} error={error} />;
};
