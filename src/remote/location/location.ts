import { env } from '@/config';
import { locationResponse } from '@/dtos/location.dto';
import { HttpClient } from '../generic/httpClient';

export class Geolocation {
  static async getLocation(address: string): Promise<locationResponse> {
    return HttpClient.callApi({
      url: `${env('REMOTE_BASE_URL')}/location/geolocation`,
      method: 'POST',
      body: {
        address,
      },
    });
  }
}
