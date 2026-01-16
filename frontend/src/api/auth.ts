import type { TokenResponse } from '../types/Auth';
import { httpClient, setToken as setHttpClientToken } from './httpClient';

const TOKEN_KEY = 'jwt_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const EXPIRES_AT_KEY = 'expires_at';

export const getStoredToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const getStoredRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const getStoredExpiresAt = (): string | null => {
  return localStorage.getItem(EXPIRES_AT_KEY);
};

export const isTokenExpired = (): boolean => {
  const expiresAt = getStoredExpiresAt();
  if (!expiresAt) {
    return true;
  }
  return new Date() > new Date(expiresAt);
};

export const storeTokens = (token: string, refreshToken: string, expiresAt: string) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  localStorage.setItem(EXPIRES_AT_KEY, expiresAt);
  setHttpClientToken(token);
};

export const clearTokens = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(EXPIRES_AT_KEY);
  setHttpClientToken(null);
};

export const register = async (data: unknown) => {
  return httpClient.post<unknown, unknown>('/auth/register', data);
};

export const login = async (data: unknown): Promise<TokenResponse> => {
  const response = await httpClient.post<TokenResponse, unknown>('/auth/login', data);
  storeTokens(response.token, response.refreshToken, response.expiresAt);
  return response;
};

export const refreshAccessToken = async (): Promise<TokenResponse> => {
  const refreshToken = getStoredRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token available.');
  }
  const response = await httpClient.post<TokenResponse, { refreshToken: string }>(
    '/auth/refresh',
    { refreshToken }
  );
  storeTokens(response.token, response.refreshToken, response.expiresAt);
  return response;
};
