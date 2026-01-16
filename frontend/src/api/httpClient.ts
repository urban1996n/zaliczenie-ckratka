const BASE_URL = 'http://localhost:5010/api';

import { getStoredToken, isTokenExpired, refreshAccessToken } from './auth';

let token: string | null = getStoredToken();

export const setToken = (newToken: string | null) => {
  token = newToken;
};

const ensureValidToken = async () => {
  if (token && isTokenExpired()) {
    try {
      const { token: newToken } = await refreshAccessToken();
      token = newToken;
    } catch (error) {
      console.error('Failed to refresh token', error);
      // Handle token refresh failure, e.g., by logging out the user
    }
  }
};

const getHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  if (response.status === 204) {
    return Promise.resolve({} as T);
  }
  return response.json();
};

export const httpClient = {
  get: async <T>(url: string): Promise<T> => {
    await ensureValidToken();
    const response = await fetch(`${BASE_URL}${url}`, {
      headers: getHeaders(),
    });
    return handleResponse<T>(response);
  },
  post: async <T, U>(url: string, data: U): Promise<T> => {
    await ensureValidToken();
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<T>(response);
  },
  put: async <T, U>(url: string, data: U): Promise<T> => {
    await ensureValidToken();
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<T>(response);
  },
  delete: async <T>(url: string): Promise<T> => {
    await ensureValidToken();
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse<T>(response);
  },
};
