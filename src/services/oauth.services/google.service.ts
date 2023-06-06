import { env } from '@/config';
import { GoogleOAuthDto } from '@/dtos/oauth.dto';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { User, UserRoles } from '@/models/users.model';
import { GoogleRemote } from '@/remote/auth/google.remote';
import { FastifyRequest } from 'fastify';
import { LoginTicket, OAuth2Client } from 'google-auth-library';
import { authService } from '../auth.service';
import { userService } from '../users.service';

class GoogleOAuthService implements IOAuthService {
  private client = new OAuth2Client({
    clientId: env('GOOGLE_CLIENT_ID'),
    clientSecret: env('GOOGLE_CLIENT_SECRET'),
    redirectUri: env('GOOGLE_REDIRECT_URI'),
  });

  private verifyJWT = async (token: string) =>
    await this.client.verifyIdToken({
      idToken: token,
      audience: env('GOOGLE_CLIENT_ID'),
    });

  async handleLogin(request: FastifyRequest, { code }: GoogleOAuthDto) {
    const accessTokenResp = await GoogleRemote.getAccessToken(code);
    console.log(accessTokenResp);

    if (accessTokenResp.error) {
      throw new HttpException(ErrorEnum.OAUTH_FAILED, accessTokenResp.error, accessTokenResp.error_description);
    }

    let decoded: LoginTicket;
    try {
      decoded = await this.verifyJWT(accessTokenResp.id_token);
    } catch (e) {
      console.error('Failed to verify authenticity of token', e);
      throw new HttpException(ErrorEnum.OAUTH_FAILED);
    }
    const payload = decoded.getPayload();

    let user: User = await userService.findUser({ email: payload.email });
    if (!user) {
      user = await userService.createUser({ email: payload.email, roles: [UserRoles.DEFAULT] });
      if (!user) {
        throw new HttpException(ErrorEnum.FAILED_TO_CREATE_USER);
      }
    }

    return authService.generateTokens(request, user);
  }
  getRedirectURL(): string {
    const baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth';

    const options = {
      client_id: env('GOOGLE_CLIENT_ID'),
      redirect_uri: env('GOOGLE_REDIRECT_URI'),
      response_type: 'code',
      scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'].join(' '),
      access_type: 'offline',
      prompt: 'consent',
    };

    const url = new URL(baseUrl);
    url.search = new URLSearchParams(options).toString();
    return url.toString();
  }
}

export const googleOAuthService = new GoogleOAuthService();
