import type { FC } from 'react';
import { DashboardView } from './DashboardView';

export const Dashboard: FC = () => {
  return <DashboardView summary={null} loading={false} error={null} />;
};
