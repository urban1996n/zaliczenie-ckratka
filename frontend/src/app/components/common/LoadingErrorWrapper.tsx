import type { FC, ReactNode } from 'react';

interface LoadingErrorWrapperProps {
  loading: boolean;
  error: Error | null;
  children: ReactNode;
}

export const LoadingErrorWrapper: FC<LoadingErrorWrapperProps> = ({ loading, error, children }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Error: {error.message}</p>
      </div>
    );
  }

  return <>{children}</>;
};
