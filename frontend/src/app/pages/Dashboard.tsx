import { FC } from 'react';
import { DashboardView } from './DashboardView';
import { getMockSummary } from '@/data/mockData';

export const Dashboard: FC = () => {
  const now = new Date();
  const summary = getMockSummary(now.getFullYear(), now.getMonth());

  return <DashboardView summary={summary} loading={false} error={null} />;
};
