export interface TokenClaims {
  email: string;
  sessionId: string;
  iat?: number;
  isRefresh?: boolean;
}
