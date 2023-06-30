import { env } from '@/config';
import { HttpClient } from '../generic/httpClient';

export class Geolocation {
  static async getLocation(address: string) {
    return HttpClient.callApi({
      url: `${env('REMOTE_BASE_URL')}/location/geolocation`,
      method: 'POST',
      body: {
        address,
      },
    });
  }
}
