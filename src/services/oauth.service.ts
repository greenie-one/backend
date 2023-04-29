import { LinkedInOAuthDto } from '@/dtos/oauth.dto';
import { HttpException } from '@/exceptions/httpException';
import { User, UserModel } from '@/models/users.model';
import { LinkedInRemote } from '@/remote/auth/linkedIn.remote';
import { createVerifier } from 'fast-jwt';
import { FastifyRequest } from 'fastify';
import buildGetJwks from 'get-jwks';
import { authService } from './auth.service';
import { userService } from './users.service';

class OAuthService {
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

  async handleLinkedInLogin(request: FastifyRequest, { code }: LinkedInOAuthDto) {
    const accessTokenResp = await LinkedInRemote.getAccessToken(code);

    if (accessTokenResp.error) {
      throw new HttpException(`LinkedIn auth failed, ${accessTokenResp.error}: ${accessTokenResp.error_description}`, 401);
    }

    let decoded: LinkedInOauthTokenClaims;
    try {
      decoded = await this.verifyLinkedInJWT(accessTokenResp.id_token);
    } catch (e) {
      console.error('Failed to verify authenticity of token', e);
      throw new HttpException('Failed to verify authenticity of token', 401);
    }

    let user: User = await UserModel.findOne({
      email: decoded.email,
    });

    if (!user) {
      console.info(`No user found by email ${decoded.email}, creating...`);
      user = await userService.createUser({
        email: decoded.email,
        firstName: decoded.given_name,
        lastName: decoded.family_name,
      });
    }

    return authService.generateTokens(request, user);
  }
}

export const oAuthService = new OAuthService();
