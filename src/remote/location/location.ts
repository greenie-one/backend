import { HttpClient } from '../generic/httpClient';
import { env } from '@/config';
import { LocationResponse } from '@/dtos/response/location.response';

export class Geolocation {
  static async getLocation(address: string): Promise<LocationResponse> {
    return HttpClient.callApi({
      url: `${env('REMOTE_BASE_URL')}/location/geolocation`,
      method: 'POST',
      body: {
        address,
      },
    });
  }
}
