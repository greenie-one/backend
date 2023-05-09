import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
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

  public getOAuthRedirectURL(provider: string) {
    try {
      return this.RegisteredOAuthProviders[provider as OAuthProviders].getRedirectURL();
    } catch (e) {
      throw new HttpException(ErrorEnum.OAUTH_PROVIDER_NOT_FOUND);
    }
  }

  public async handleOAuthLogin(provider: string, request: FastifyRequest, query: unknown) {
    try {
      return await this.RegisteredOAuthProviders[provider as OAuthProviders].handleLogin(request, query);
    } catch (e) {
      throw new HttpException(ErrorEnum.OAUTH_PROVIDER_NOT_FOUND);
    }
  }
}

export const oAuthService = new OAuthService();
