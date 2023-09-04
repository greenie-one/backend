export type TokenClaims = {
  email: string | null;
  sub: string;
  iss: string;
  session_id: string;
  roles: string[];
  iat: number;
  is_refresh: boolean | null;
  exp: number;
};
