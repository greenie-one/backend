import { googleOAuthService } from './oauth.service/google.service';
import { linkedInOAuthService } from './oauth.service/linkedin.service';

class OAuthService {
  private _RegisteredOAuthProviders: Record<OAuthProviders, IOAuthService> = {
    [OAuthProviders.LINKEDIN]: linkedInOAuthService,
    [OAuthProviders.GOOGLE]: googleOAuthService,
  };
  public get RegisteredOAuthProviders(): Record<OAuthProviders, IOAuthService> {
    return this._RegisteredOAuthProviders;
  }
}

export const oAuthService = new OAuthService();
