import { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import {
  login as apiLogin,
  register as apiRegister,
  refreshAccessToken as apiRefreshAccessToken,
} from '../api/auth';
import type { User, TokenResponse } from '../types/Auth';
import { useNavigate } from 'react-router-dom';
import { LocalStorageTokenContainer } from '../api/localStorageTokenContainer';
import type { ITokenContainer } from '../api/tokenContainer.ts';
import { useHttpClient } from './HttpClientContext.tsx';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  getAccessToken: () => Promise<string | null>;
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

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const httpClient = useHttpClient();
  const localStorageTokenContainer = useMemo(() => new LocalStorageTokenContainer(), []);

  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorageTokenContainer.getToken()
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = localStorageTokenContainer.onTokenChange(setAccessToken);
    return () => unsubscribe();
  }, []);

  const updateUserFromToken = useCallback((token: string | null) => {
    if (token) {
      try {
        const decodedToken = jwtDecode<{ sub: string; email: string }>(token);
        setUser({ id: decodedToken.sub, email: decodedToken.email });
      } catch (error) {
        console.error('Failed to decode token:', error);
        localStorageTokenContainer.clearTokens();
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

  const getAccessToken = useCallback(async (): Promise<string | null> => {
    const currentToken = localStorageTokenContainer.getToken();
    const currentRefreshToken = localStorageTokenContainer.getRefreshToken();
    const expiresAt = localStorageTokenContainer.getExpiresAt();

    if (!currentToken || !currentRefreshToken || !expiresAt) {
      localStorageTokenContainer.clearTokens();
      return null;
    }

    if (new Date() > new Date(expiresAt)) {
      try {
        const {
          token: newToken,
          refreshToken: newRefreshToken,
          expiresAt: newExpiresAt,
        } = await apiRefreshAccessToken(httpClient, currentRefreshToken);
        localStorageTokenContainer.setToken(newToken);
        localStorageTokenContainer.setRefreshToken(newRefreshToken);
        localStorageTokenContainer.setExpiresAt(newExpiresAt);
        return newToken;
      } catch (error) {
        console.error('Failed to refresh token', error);
        localStorageTokenContainer.clearTokens();
        return null;
      }
    }
    return currentToken;
  }, []);

  const login = useCallback(
    async (data: unknown) => {
      const response: TokenResponse = await apiLogin(httpClient, data);
      localStorageTokenContainer.setToken(response.token);
      localStorageTokenContainer.setRefreshToken(response.refreshToken);
      localStorageTokenContainer.setExpiresAt(response.expiresAt);
      updateUserFromToken(response.token);
      navigate('/dashboard');
    },
    [updateUserFromToken, navigate]
  );

  const register = useCallback(async (data: unknown) => {
    await apiRegister(httpClient, data);
  }, []);

  const logout = useCallback(() => {
    localStorageTokenContainer.clearTokens();
    setUser(null);
  }, []);

  const isAuthenticated = useMemo(() => !!user, [user]);

  const authContextValue = useMemo(
    () => ({
      user,
      isAuthenticated,
      accessToken,
      getAccessToken,
      login,
      register,
      logout,
      isLoading,
    }),
    [user, isAuthenticated, accessToken, getAccessToken, login, register, logout, isLoading]
  );

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};
