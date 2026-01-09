import { useHealth } from '../../hooks/useHealth';
import { HealthStatusView } from './HealthStatusView';

export const HealthStatus = () => {
  const { health, loading, error } = useHealth();

  return <HealthStatusView health={health} loading={loading} error={error} />;
};
