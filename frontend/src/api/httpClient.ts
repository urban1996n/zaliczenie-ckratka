import { type ITokenContainer, type Token } from './tokenContainer';
import { refreshAccessToken } from './auth';

const BASE_URL = 'http://localhost:5010/api';

const MAX_RETRIES = 5;
let CURRENT_TRY = 0;

const isTokenValid = (token: Token | null) => {
  if (!token) {
    return false;
  }

  return new Date() < new Date(token.expiresAt);
};

const tryRefreshToken = async (httpClient: HttpClient, token: Token | null): Promise<Token> => {
  if (!token?.refreshToken) {
    throw new Error('Cannot refresh token');
  }

  while (true) {
    CURRENT_TRY++;
    if (CURRENT_TRY >= MAX_RETRIES) {
      throw new Error('Maximum retries exceeded');
    }

    try {
      const response = await refreshAccessToken(httpClient, token.refreshToken);

      if (!response) {
        console.error('Empty access token response');

        continue;
      }

      return {
        accessToken: response.token,
        expiresAt: response.expiresAt,
        refreshToken: response.refreshToken,
      };
    } catch (error) {
      console.error(error);
    }
  }
};

export class HttpClient {
  private accessGranted: boolean = false;

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
      headers['Authorization'] = `Bearer ${token.accessToken}`;
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
    if (/\/auth\/(login|register|refresh)$/.test(url)) {
      return;
    }

    const token = this.tokenContainer.getToken();
    if (!isTokenValid(token) || !this.accessGranted) {
      try {
        const newToken = await tryRefreshToken(this, token);

        this.tokenContainer.setToken(newToken);
        this.accessGranted = true;
      } catch (e) {
        console.error(e);

        this.accessGranted = false;
        this.tokenContainer.clearToken();
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
