import { type ITokenContainer } from './tokenContainer';
import { refreshAccessToken } from './auth';

const BASE_URL = 'http://localhost:5010/api';

export class HttpClient {
  private tokenContainer: ITokenContainer;

  constructor(tokenContainer: ITokenContainer) {
    this.tokenContainer = tokenContainer;
  }

  private getHeaders = () => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const token = this.tokenContainer.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  private handleResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    if (response.status === 204) {
      return Promise.resolve({} as T);
    }
    return response.json();
  };

  private ensureValidToken = async (url: string) => {
    if (/\/auth\/(login|register)$/.test(url)) {
      return;
    }

    const token = this.tokenContainer.getToken();
    const expiresAt = this.tokenContainer.getExpiresAt();

    if (token && expiresAt && new Date() > new Date(expiresAt)) {
      try {
        const {
          token: newToken,
          refreshToken: newRefreshToken,
          expiresAt: newExpiresAt,
        } = await refreshAccessToken(this, this.tokenContainer.getRefreshToken() || '');
        this.tokenContainer.setToken(newToken);
        this.tokenContainer.setRefreshToken(newRefreshToken);
        this.tokenContainer.setExpiresAt(newExpiresAt);
      } catch (error) {
        console.error('Failed to refresh token', error);
        this.tokenContainer.clearTokens();
        // Handle token refresh failure, e.g., by logging out the user
      }
    }
  };

  get = async <T>(url: string): Promise<T> => {
    await this.ensureValidToken(url);
    const response = await fetch(`${BASE_URL}${url}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse<T>(response);
  };

  post = async <T, U>(url: string, data: U): Promise<T> => {
    await this.ensureValidToken(url);
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<T>(response);
  };

  put = async <T, U>(url: string, data: U): Promise<T> => {
    await this.ensureValidToken(url);
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<T>(response);
  };

  delete = async <T>(url: string): Promise<T> => {
    await this.ensureValidToken(url);
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse<T>(response);
  };
}
