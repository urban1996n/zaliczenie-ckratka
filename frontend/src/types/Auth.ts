export interface TokenResponse {
  token: string;
  refreshToken: string;
  expiresAt: string;
}

export interface User {
  id: string;
  email: string;
}
