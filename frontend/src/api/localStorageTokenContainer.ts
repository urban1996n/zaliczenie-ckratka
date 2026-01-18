import type { ITokenContainer, Token } from './tokenContainer';

const TOKEN_KEY = 'jwt_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const EXPIRES_AT_KEY = 'expires_at';

export class LocalStorageTokenContainer implements ITokenContainer {
  private tokenChangeListeners: ((token: Token | null) => void)[] = [];
  private clearStorageListener: (() => void)[] = [];

  public setToken(token: Token | null) {
    if (!token) {
      return;
    }

    const { accessToken, refreshToken, expiresAt } = token;

    this.setAccessToken(accessToken);
    this.setRefreshToken(refreshToken);
    this.setExpiresAt(expiresAt);
    this.notifyListeners(token);
  }

  getToken = (): Token | null => {
    const accessToken = this.getAccesstoken();
    const refreshToken = this.getRefreshToken();
    const expiresAt = this.getExpiresAt();

    if (!accessToken || !refreshToken || !expiresAt) {
      return null;
    }

    return { accessToken, refreshToken, expiresAt };
  };

  getRefreshToken = (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  };

  getExpiresAt = (): string | null => {
    return localStorage.getItem(EXPIRES_AT_KEY);
  };

  setAccessToken = (token: string | null) => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  };

  private getAccesstoken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private setRefreshToken = (refreshToken: string | null) => {
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    } else {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  };

  private setExpiresAt = (expiresAt: string | null) => {
    if (expiresAt) {
      localStorage.setItem(EXPIRES_AT_KEY, expiresAt);
    } else {
      localStorage.removeItem(EXPIRES_AT_KEY);
    }
  };

  clearToken = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(EXPIRES_AT_KEY);

    this.notifyListeners(null);
  };

  onTokenChange = (callback: (token: Token | null) => void): (() => void) => {
    this.tokenChangeListeners.push(callback);
    return () => {
      this.tokenChangeListeners = this.tokenChangeListeners.filter(
        (listener) => listener !== callback
      );
    };
  };

  onClearToken(callback: () => void) {
    this.clearStorageListener.push(callback);

    return () => this.clearStorageListener.filter((listener) => listener !== callback);
  }

  private notifyListeners = (token: Token | null) => {
    this.tokenChangeListeners.forEach((listener) => listener(token));
  };
}
