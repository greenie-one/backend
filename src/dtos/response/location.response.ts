import { NormalizedAddress } from "./ids.response";

export interface GetLocationResponse {
  id: string;
  longitude: number;
  latitude: number;
  formattedAddress: string;
  user: string;
}

export type GetAutocompleteResponse = {
  address: string
  placeId: string
}[]
