import { AddressType } from '@/models/location.model';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export interface locationResponse {
  code?: string;
}

export class GPScompare {
  @IsString()
  @IsNotEmpty()
  public GPS: string;
}

export class GetLocationResponse {
  @IsString()
  @IsNotEmpty()
  public locationId!: string;

  @IsString()
  @IsNotEmpty()
  public address!: string;

  @IsString()
  @IsNotEmpty()
  public coordinates!: string;

  @IsEnum(AddressType)
  @IsString()
  @IsNotEmpty()
  public type!: AddressType;

  @IsString()
  @IsNotEmpty()
  public user!: string;
}
