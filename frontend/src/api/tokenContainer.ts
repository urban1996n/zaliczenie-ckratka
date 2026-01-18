export interface Token {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

export interface ITokenContainer {
  getToken: () => Token | null;
  setToken: (token: Token | null) => void;
  clearToken: () => void;
  onTokenChange: (callback: (token: Token | null) => void) => () => void;
  onClearToken: (callback: () => void) => () => void;
}
