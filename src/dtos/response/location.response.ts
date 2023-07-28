export interface GetLocationResponse {
  id: string;
  longitude: Number;
  latitude: Number;
  user: string;
}

export interface LocationResponse {
  code: string,
  longitude: Number,
  latitude: Number
}

export type CaptureUserLocationResponse = Record<string, never>
export type CapturePeerLocationResponse = Record<string, never>

