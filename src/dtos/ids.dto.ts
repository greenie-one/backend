import { IDTypeEnum } from '@/models/id.model';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddIDDto {
  @IsEnum(IDTypeEnum)
  @IsNotEmpty()
  public id_type?: IDTypeEnum;

  @IsString()
  @IsOptional()
  public id_number?: string;

  @IsString()
  @IsOptional()
  public otp?: string;
}

export interface AadharRequestOtpResponse {
  request_id?: string;
}

export interface AadharVerifyOtpResponse {
  aadhaar_data?: string;
}
