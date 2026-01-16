import { type FC, useEffect } from 'react';
import { DashboardView } from './DashboardView';
import { useMonthlySummary } from 'hooks/useMonthlySummary.ts';

export const Dashboard: FC = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const { summary, loading, error, fetchSummary } = useMonthlySummary(year, month);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return <DashboardView summary={summary} loading={loading} error={error} />;
};
