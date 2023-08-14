import { env } from '@/config';
import { AutocompleteResponse } from '../dtos/autocomplete.response';
import { LocationResponse } from '../dtos/geolocation.response';
import { HttpClient } from '../generic/httpClient';

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

  static async autocomplete(term: string, latitude?: number, longitude?: number): Promise<AutocompleteResponse> {
    let url = `${env('REMOTE_BASE_URL')}/location/suggestion?address=${term}`
    if (latitude && longitude) {
      url += `&latitude=${latitude}&longitude=${longitude}`
    }
    return HttpClient.callApi({
      url,
      method: 'GET',
    });
  }
}
