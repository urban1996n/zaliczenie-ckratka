export interface ITokenContainer {
  getToken: () => string | null;
  getRefreshToken: () => string | null;
  getExpiresAt: () => string | null;
  setToken: (token: string | null) => void;
  setRefreshToken: (refreshToken: string | null) => void;
  setExpiresAt: (expiresAt: string | null) => void;
  clearTokens: () => void;
  onTokenChange: (callback: (token: string | null) => void) => () => void;
}