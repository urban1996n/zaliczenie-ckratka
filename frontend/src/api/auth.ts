import type { TokenResponse } from '../types/Auth';
import { HttpClient } from './httpClient';





export const register = async (httpClient: HttpClient, data: unknown) => {
  return httpClient.post<unknown, unknown>('/auth/register', data);
};

export const login = async (httpClient: HttpClient, data: unknown): Promise<TokenResponse> => {
  const response = await httpClient.post<TokenResponse, unknown>('/auth/login', data);
  return response;
};

export const refreshAccessToken = async (httpClient: HttpClient, oldRefreshToken: string): Promise<TokenResponse> => {
  if (!oldRefreshToken) {
    throw new Error('No refresh token available.');
  }
  const response = await httpClient.post<TokenResponse, { refreshToken: string }>(
    '/auth/refresh',
    { refreshToken: oldRefreshToken }
  );
  return response;
};
