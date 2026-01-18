import { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import { HttpClient } from '../api/httpClient';
import type { ITokenContainer } from '../api/tokenContainer.ts';

interface HttpContextType {
  httpClient: HttpClient;
}

export const HttpContext = createContext<HttpContextType | undefined>(undefined);

interface AuthProviderProps {
  tokenContainer: ITokenContainer;
  children: ReactNode;
}

export const HttpProvider = ({ tokenContainer, children }: AuthProviderProps) => {
  const httpClient = useMemo(() => new HttpClient(tokenContainer), []);

  return <HttpContext.Provider value={{ httpClient }}>{children}</HttpContext.Provider>;
};

export const useHttpClient = () => {
  const context = useContext(HttpContext);

  if (!context) {
    throw new Error('useHttpClient must be used within an HttpProvider');
  }

  return context.httpClient;
};
