import { env } from '@/config';
import { LinkedInAccessTokenResponse } from '@/dtos/oauth.dto';
import { HttpClient } from '../generic/httpClient';

export class LinkedInRemote {
  static async getAccessToken(code: string): Promise<LinkedInAccessTokenResponse> {
    return HttpClient.callApi({
      url: `https://www.linkedin.com/oauth/v2/accessToken`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: {
        grant_type: 'authorization_code',
        code,
        client_id: env('LINKEDIN_CLIENT_ID'),
        client_secret: env('LINKEDIN_CLIENT_SECRET'),
        redirect_uri: env('LINKEDIN_REDIRECT_URI'),
      },
    });
  }

  static async getProfileDetails(accessToken: string) {
    return HttpClient.callApi({
      url: 'https://api.linkedin.com/v2/me',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  static async discoverJWKS(): Promise<LinkedInJWTDiscovery> {
    return HttpClient.callApi({
      url: 'https://www.linkedin.com/oauth/.well-known/openid-configuration',
      method: 'GET',
    });
  }
}
