import type { FC } from 'react';
import { useEffect } from 'react';
import { useMonthlySummary } from '../../hooks/useMonthlySummary';
import DashboardView from './DashboardView';

export const Dashboard: FC = () => {
  return <DashboardView summary={summary} loading={loading} error={error} />;
};
