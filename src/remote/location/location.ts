import { env } from '@/config';
import { AutocompleteResponse, PlaceResponse } from '../dtos/autocomplete.response';
import { HttpClient } from '../generic/httpClient';

export class Geolocation {
  static async getLocation(address: string): Promise<PlaceResponse> {
    return HttpClient.callApi({
      url: `${env('REMOTE_BASE_URL')}/location/place?address=${address}`,
      method: 'GET',
    });
  }

  static async autocomplete(partialAdress: string): Promise<AutocompleteResponse[]> {
    const url = `${env('REMOTE_BASE_URL')}/location/suggestion?address=${partialAdress}`
    return HttpClient.callApi({
      url,
      method: 'GET',
    });
  }

  static async getPlaceDetails(placeId: string): Promise<PlaceResponse> {
    const url = `${env('REMOTE_BASE_URL')}/location/place?placeId=${placeId}`
    return HttpClient.callApi({
      url,
      method: 'GET',
    });
  }
}
