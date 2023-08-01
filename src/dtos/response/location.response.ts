import { NormalizedAddress } from "./ids.response";

export interface GetLocationResponse {
  id: string;
  longitude: number;
  latitude: number;
  user: string;
}

export type GetAutocompleteResponse = {
  id: string
  score: number
  address: NormalizedAddress
  addressString: string
  position: {
    longitude: number;
    latitude: number;
  }
}[]

export type CaptureUserLocationResponse = Record<string, never>
export type CapturePeerLocationResponse = Record<string, never>
