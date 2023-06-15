import { sanitizeMobileNumber } from '@/utils/validation';
import { Transform, Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength, ValidateIf } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @ValidateIf((obj, val) => val || !obj.mobileNumber)
  email: string;

  @IsString()
  @Matches(/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/)
  @ValidateIf((obj, val) => val || !obj.email)
  @Type(() => String)
  @Transform((params) => sanitizeMobileNumber(params.value))
  mobileNumber?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(72)
  @ValidateIf((obj, val) => val || obj.email)
  password?: string;
}

export class LoginDto {
  @IsEmail()
  @ValidateIf((obj, val) => val || !obj.mobileNumber)
  email: string;

  @IsString()
  @Matches(/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/)
  @ValidateIf((obj, val) => val || !obj.email)
  @Type(() => String)
  @Transform((params) => sanitizeMobileNumber(params.value))
  mobileNumber: string;

  @IsString()
  @ValidateIf((obj, val) => val || obj.email)
  password: string;
}

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  @Matches(/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/)
  @Type(() => String)
  @Transform((params) => sanitizeMobileNumber(params.value))
  mobileNumber?: string;
}

export enum ValidationType {
  LOGIN = 'LOGIN',
  SINGUP = 'SIGNUP',
}

export class ValidateOtpDTO {
  @IsString()
  otp: string;

  @IsString()
  validationId: string;
}

export class ResendOtpDTO {
  @IsString()
  validationId: string;
}
