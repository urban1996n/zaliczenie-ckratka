import { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { login as apiLogin, register as apiRegister } from '../api/auth';
import type { User, TokenResponse } from '../types/Auth';
import { useNavigate } from 'react-router-dom';
import type { ITokenContainer } from '../api/tokenContainer.ts';
import { useHttpClient } from './HttpClientContext.tsx';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (data: unknown) => Promise<void>;
  register: (data: unknown) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  tokenContainer: ITokenContainer;
  children: ReactNode;
}

export const AuthProvider = ({ children, tokenContainer }: AuthProviderProps) => {
  const httpClient = useHttpClient();

  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(
    tokenContainer.getToken()?.accessToken ?? null
  );

  useEffect(() => {
    const unsubscribeFromTokenListener = tokenContainer.onTokenChange((token) => {
      setAccessToken(token?.accessToken ?? null);
    });

    const unsubscribFromTokenClearListener = tokenContainer.onClearToken(() => {
      setAccessToken(null);
      navigate('/auth');
    });

    return () => {
      unsubscribeFromTokenListener();
      unsubscribFromTokenClearListener();
    };
  }, []);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const updateUserFromToken = useCallback((token: string | null) => {
    if (token) {
      try {
        const decodedToken = jwtDecode<{ sub: string; email: string }>(token);
        setUser({ id: decodedToken.sub, email: decodedToken.email });
      } catch (error) {
        console.error('Failed to decode token:', error);
        tokenContainer.clearToken();
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    updateUserFromToken(accessToken);
  }, [accessToken, updateUserFromToken]);

  const login = useCallback(
    async (data: unknown) => {
      const { refreshToken, expiresAt, token }: TokenResponse = await apiLogin(httpClient, data);
      tokenContainer.setToken({ accessToken: token, refreshToken, expiresAt });

      updateUserFromToken(token);
      navigate('/dashboard');
    },
    [updateUserFromToken, navigate]
  );

  const register = useCallback(async (data: unknown) => {
    await apiRegister(httpClient, data);
  }, []);

  const logout = useCallback(() => {
    tokenContainer.clearToken();
    setUser(null);
  }, []);

  const isAuthenticated = useMemo(() => !!user, [user]);

  const authContextValue = useMemo(
    () => ({
      user,
      isAuthenticated,
      login,
      register,
      logout,
      isLoading,
    }),
    [user, isAuthenticated, login, register, logout, isLoading]
  );

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};
