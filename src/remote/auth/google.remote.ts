import { env } from '@/config';
import { GoogleAccessTokenResponse } from '@/dtos/oauth.dto';
import { HttpClient } from '../generic/httpClient';

export class GoogleRemote {
  static async getAccessToken(code: string): Promise<GoogleAccessTokenResponse> {
    return HttpClient.callApi({
      url: `https://oauth2.googleapis.com/token`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: {
        grant_type: 'authorization_code',
        code,
        client_id: env('GOOGLE_CLIENT_ID'),
        client_secret: env('GOOGLE_CLIENT_SECRET'),
        redirect_uri: env('GOOGLE_REDIRECT_URI'),
      },
    });
  }
}
