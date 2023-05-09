import { env } from '@/config';
import { LinkedInOAuthDto } from '@/dtos/oauth.dto';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { User, UserModel, UserRoles } from '@/models/users.model';
import { LinkedInRemote } from '@/remote/auth/linkedIn.remote';
import { createVerifier } from 'fast-jwt';
import { FastifyRequest } from 'fastify';
import buildGetJwks from 'get-jwks';
import { authService } from '../auth.service';
import { profileService } from '../profile.service';
import { userService } from '../users.service';

class LinkedInOAuthService implements IOAuthService {
  private jwksBuilder = buildGetJwks({
    providerDiscovery: true,
  });

  private verifyLinkedInJWT = createVerifier({
    key: async (token: TokenSignature) =>
      this.jwksBuilder.getPublicKey({
        kid: token.kid,
        alg: token.alg,
        domain: 'https://www.linkedin.com/oauth',
      }),
  });

  async handleLogin(request: FastifyRequest, { code }: LinkedInOAuthDto) {
    const accessTokenResp = await LinkedInRemote.getAccessToken(code);

    if (accessTokenResp.error) {
      throw new HttpException(ErrorEnum.LINKEDIN_AUTH_FAILED, accessTokenResp.error, accessTokenResp.error_description);
    }

    let decoded: LinkedInOauthTokenClaims;
    try {
      decoded = await this.verifyLinkedInJWT(accessTokenResp.id_token);
    } catch (e) {
      console.error('Failed to verify authenticity of token', e);
      throw new HttpException(ErrorEnum.LINKEDIN_TOKEN_UNAUTHENTICATED);
    }

    let user: User = await UserModel.findOne({
      email: decoded.email,
    });

    if (!user) {
      console.info(`No user found by email ${decoded.email}, creating...`);
      user = await userService.createUser({
        email: decoded.email,
        roles: [UserRoles.DEFAULT],
      });

      if (!user) {
        throw new HttpException(ErrorEnum.FAILED_TO_CREATE_USER);
      }

      const profile = await profileService.createProfile(user._id, {
        first_name: decoded.given_name,
        last_name: decoded.family_name,
      });

      if (!profile) {
        throw new HttpException(ErrorEnum.FAILED_TO_CREATE_PROFILE);
      }
    }

    return authService.generateTokens(request, user);
  }

  getRedirectURL() {
    const baseURL = new URL('https://www.linkedin.com/oauth/v2/authorization');
    baseURL.searchParams.set('response_type', 'code');
    baseURL.searchParams.set('client_id', env('LINKEDIN_CLIENT_ID'));
    baseURL.searchParams.set('redirect_uri', env('LINKEDIN_REDIRECT_URI'));
    baseURL.searchParams.set('scope', 'openid email profile r_liteprofile');

    return baseURL.toString();
  }

  async getLinkedInDiscovery() {
    console.log('Fetching LinkedIn discovery document...');
  }
}

export const linkedInOAuthService = new LinkedInOAuthService();
