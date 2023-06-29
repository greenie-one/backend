import { IDTypeEnum } from '@/models/id.model';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddIDDto {
  @IsEnum(IDTypeEnum)
  @IsOptional()
  public id_type?: IDTypeEnum;

  @IsString()
  @IsOptional()
  public id_number?: string;

  @IsString()
  @IsOptional()
  public dob?: string;
}

export class VerifyIDDto {
  @IsString()
  @IsNotEmpty()
  public otp!: string;

  @IsString()
  @IsNotEmpty()
  public request_id!: string;

  @IsString()
  @IsNotEmpty()
  public task_id!: string;
}

export interface AadharRequestOtpResponse {
  result?: {
    is_number_linked?: boolean;
    is_aadhaar_valid?: boolean;
  };
  request_id?: string;
  success?: boolean;
  response_code?: string;
  response_message?: string;
}

export interface AadharVerifyOtpResponse {
  result?: {
    user_aadhaar_number?: string;
    user_address?: {
      country?: string;
      dist?: string;
      state?: string;
      po?: string;
      loc?: string;
      vtc?: string;
      subdist?: string;
      street?: string;
      house?: string;
      landmark?: string;
    };
  };
  success?: boolean;
  response_code?: string;
  response_message?: string;
}

export interface PanVerifyResponse {
  success?: boolean;
  response_code?: string;
  response_message?: string;
}

export interface DrivingLicenseResponse {
  success?: boolean;
  response_code?: string;
  response_message?: string;
}
