import { sanitizeMobileNumber } from '@/utils/validation';
import { Transform, Type } from 'class-transformer';
import { IsEmail, IsMobilePhone, IsNotEmpty, IsString, Matches, MaxLength, MinLength, ValidateIf } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @ValidateIf((obj, val) => val || !obj.mobileNumber)
  email: string;

  @IsString()
  @Matches(/((\+*)((0[ -]*)*|((91 )*))((\d{12})+|(\d{10})+))|\d{5}([- ]*)\d{6}/)
  @ValidateIf((obj, val) => val || !obj.email)
  @Type(() => String)
  @Transform((params) => sanitizeMobileNumber(params.value))
  mobileNumber?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(72)
  password?: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;
}

export class LoginDto {
  @IsEmail()
  @ValidateIf((obj, val) => val || !obj.mobileNumber)
  email: string;

  @IsString()
  @IsMobilePhone('en-IN')
  @ValidateIf((obj, val) => val || !obj.email)
  @Type(() => String)
  @Transform((params) => sanitizeMobileNumber(params.value))
  mobileNumber: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class ValidateOtpDTO {
  @IsString()
  otp: string;

  @IsMobilePhone('en-IN')
  @Type(() => String)
  @Transform((params) => sanitizeMobileNumber(params.value))
  mobileNumber: string;
}
