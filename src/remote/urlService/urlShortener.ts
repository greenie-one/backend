import { env } from '@/config';
import { HttpClient } from '../generic/httpClient';
import { ShortenUrlResponse } from '../dtos/shortenUrl.response';

export class UrlShortener {
  static async shortenUrl(url: string): Promise<ShortenUrlResponse> {
    return HttpClient.callApi({
      url: `${env('REMOTE_BASE_URL')}/url/shorten`,
      method: 'POST',
      body: { url },
    });
  }
}