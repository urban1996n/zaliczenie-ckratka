import type { ITokenContainer } from './tokenContainer';

const TOKEN_KEY = 'jwt_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const EXPIRES_AT_KEY = 'expires_at';

export class LocalStorageTokenContainer implements ITokenContainer {
  private listeners: ((token: string | null) => void)[] = [];

  getToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  };

  getRefreshToken = (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  };

  getExpiresAt = (): string | null => {
    return localStorage.getItem(EXPIRES_AT_KEY);
  };

  setToken = (token: string | null) => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
    this.notifyListeners(token);
  };

  setRefreshToken = (refreshToken: string | null) => {
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    } else {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  };

  setExpiresAt = (expiresAt: string | null) => {
    if (expiresAt) {
      localStorage.setItem(EXPIRES_AT_KEY, expiresAt);
    } else {
      localStorage.removeItem(EXPIRES_AT_KEY);
    }
  };

  clearTokens = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(EXPIRES_AT_KEY);
    this.notifyListeners(null);
  };

  onTokenChange = (callback: (token: string | null) => void): (() => void) => {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((listener) => listener !== callback);
    };
  };

  private notifyListeners = (token: string | null) => {
    this.listeners.forEach((listener) => listener(token));
  };
}
