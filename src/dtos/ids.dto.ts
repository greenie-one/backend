import { IDTypeEnum } from '@/models/id.model';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddIDDto {
  @IsEnum(IDTypeEnum)
  @IsNotEmpty()
  public id_type!: IDTypeEnum;

  @IsString()
  @IsOptional()
  public id_number?: string;
}

export class VerifyIDDto {
  @IsString()
  @IsNotEmpty()
  public otp: string;

  @IsString()
  @IsNotEmpty()
  public request_id: string;
}

export interface AadharRequestOtpResponse {
  request_id?: string;
}

export interface AadharVerifyOtpResponse {
  aadhaar_data?: string;
}
