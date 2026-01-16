import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from 'hooks/useAuth';
import { LoadingErrorWrapper } from 'app/components/common/LoadingErrorWrapper';

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <LoadingErrorWrapper loading={true} error={null}>
        ...
      </LoadingErrorWrapper>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/auth" />;
};
