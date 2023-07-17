import { AddressType } from '@/models/location.model';
import { IsNotEmpty, IsString } from 'class-validator';

export interface locationResponse {
  code?: string;
}

export class GPScompare {
  @IsString()
  @IsNotEmpty()
  public GPS: string;
}

export interface GetLocationResponse {
  id: string;
  address: string;
  coordinates: string;
  type: AddressType;
  user: string;
}
