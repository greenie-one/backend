import { IsISO8601, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddResidentialInfoDto {
  @IsString()
  @IsNotEmpty()
  public address_line_1!: string;

  @IsString()
  @IsNotEmpty()
  public address_line_2!: string;

  @IsString()
  @IsNotEmpty()
  public landmark!: string;

  @IsString()
  @IsNotEmpty()
  public pincode!: string;

  @IsString()
  @IsNotEmpty()
  public city!: string;

  @IsString()
  @IsNotEmpty()
  public state!: string;

  @IsString()
  @IsNotEmpty()
  public country!: string;

  @IsISO8601()
  @IsOptional()
  public start_date?: Date;

  @IsISO8601()
  @IsOptional()
  public end_date?: Date;
}

export class UpdateResidentialInfoDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public address_line_1?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public address_line_2?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public landmark?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public pincode?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public state?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public country?: string;

  @IsISO8601()
  @IsOptional()
  public start_date?: Date;

  @IsISO8601()
  @IsOptional()
  public end_date?: Date;
}

export interface AddResidentialInfoResponse {
  id: string;
  success: boolean;
}

export interface residentialInfoResponseDto {
  id: string;
  address_line_1: string;
  address_line_2: string;
  landmark: string;
  pincode: string;
  city: string;
  state: string;
  country: string;
  start_date: string;
  end_date: string;
}

export interface GetResidentialInfoResponse {
  residentialInfos: residentialInfoResponseDto[];
}
