import type { ComponentType, FC } from 'react';

interface WithLoaderProps {
  loading: boolean;
  error: Error | null;
}

export const withLoader =
  <P extends object>(WrappedComponent: ComponentType<P>): FC<P & WithLoaderProps> =>
  ({ loading, error, ...props }) => {
    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Error: {error.message}</div>;
    }

    return <WrappedComponent {...(props as P)} />;
  };
