import type { Health } from '../../types/Health';

interface HealthStatusViewProps {
  health: Health | null;
  loading: boolean;
  error: Error | null;
}

export const HealthStatusView = ({ health, loading, error }: HealthStatusViewProps) => {
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Backend Status</h1>
      <p>{health?.status}</p>
    </div>
  );
};
