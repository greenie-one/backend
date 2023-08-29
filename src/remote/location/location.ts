import { env } from '@/config';
import { AutocompleteResponse, PlaceResponse } from '../dtos/autocomplete.response';
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

  static async autocomplete(partialAdress: string): Promise<AutocompleteResponse[]> {
    const url = `${env('REMOTE_BASE_URL')}/location/suggestion?address=${partialAdress}`
    return HttpClient.callApi({
      url,
      method: 'GET',
    });
  }

  static async getPlaceDetails(placeId: string): Promise<PlaceResponse>{
    const url = `${env('REMOTE_BASE_URL')}/location/place?placeId=${placeId}`
    return HttpClient.callApi({
      url,
      method: 'GET',
    });
  }
}
