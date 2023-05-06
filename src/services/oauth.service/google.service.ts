import { GoogleOAuthDto } from '@/dtos/oauth.dto';
import { User } from '@/models/users.model';
import { GoogleRemote } from '@/remote/auth/google.remote';
import { FastifyRequest } from 'fastify';

class GoogleOAuthService implements IOAuthService {
  async handleLogin(request: FastifyRequest, { code }: GoogleOAuthDto): Promise<User> {
    const accessTokenResp = await GoogleRemote.getAccessToken(code);
    console.log(accessTokenResp);
    // TODO: Implement
    return null;
  }
  getRedirectURL(): string {
    const baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth';

    const options = {
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
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
