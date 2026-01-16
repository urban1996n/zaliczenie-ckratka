import { createContext, useState, useEffect, useMemo, useCallback, useContext } from 'react';
import type { ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import {
  getStoredToken,
  clearTokens,
  login as apiLogin,
  register as apiRegister,
  getStoredRefreshToken,
} from '../api/auth';
import type { User } from '../types/Auth';

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
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const updateUserFromToken = useCallback(() => {
    const token = getStoredToken();
    const refreshToken = getStoredRefreshToken();

    if (token && refreshToken) {
      try {
        const decodedToken = jwtDecode<{ sub: string; email: string }>(token);
        setUser({ id: decodedToken.sub, email: decodedToken.email });
      } catch (error) {
        console.error('Failed to decode token:', error);
        clearTokens();
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    updateUserFromToken();
  }, [updateUserFromToken]);

  const login = useCallback(
    async (data: unknown) => {
      await apiLogin(data);
      updateUserFromToken();
    },
    [updateUserFromToken]
  );

  const register = useCallback(async (data: unknown) => {
    await apiRegister(data);
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
  }, []);

  const authContextValue = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      isLoading,
    }),
    [user, login, register, logout, isLoading]
  );

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};
