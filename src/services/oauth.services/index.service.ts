import { FastifyRequest } from 'fastify';
import { googleOAuthService } from './google.service';
import { linkedInOAuthService } from './linkedin.service';

export enum OAuthProviders {
  LINKEDIN = 'linkedin',
  GOOGLE = 'google',
}

class OAuthService {
  private _RegisteredOAuthProviders: Record<OAuthProviders, IOAuthService> = {
    [OAuthProviders.LINKEDIN]: linkedInOAuthService,
    [OAuthProviders.GOOGLE]: googleOAuthService,
  };
  public get RegisteredOAuthProviders(): Record<OAuthProviders, IOAuthService> {
    return this._RegisteredOAuthProviders;
  }

  public getOAuthRedirectURL(provider: OAuthProviders) {
    return this.RegisteredOAuthProviders[provider].getRedirectURL();
  }

  public async handleOAuthLogin(provider: OAuthProviders, request: FastifyRequest, query: unknown) {
    return await this.RegisteredOAuthProviders[provider].handleLogin(request, query);
  }
}

export const oAuthService = new OAuthService();
