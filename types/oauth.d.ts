interface LinkedInOauthTokenClaims {
  iss: string;
  aud: string;
  iat: number;
  exp: number;
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  email: string;
  email_verified: string;
  picture?: string;
  locale: string;
}

interface TokenSignature {
  zip: string;
  typ: string;
  kid: string;
  alg: string;
}

interface LinkedInJWTDiscovery {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  userinfo_endpoint: string;
  jwks_uri: string;
  response_types_supported: string[];
  subject_types_supported: string[];
  id_token_signing_alg_values_supported: string[];
  scopes_supported: string[];
  claims_supported: string[];
}

interface IOAuthService {
  handleLogin(request: FastifyRequest, params: unknown): Promise<{ accessToken: string; refreshToken: string }>;
  getRedirectURL(): string;
}
