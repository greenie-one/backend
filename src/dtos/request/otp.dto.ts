import { IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export enum OtpType {
  EMAIL = 'EMAIL',
  MOBILE = 'MOBILE',
}

export class VerifyOtpDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(6)
  otp: string;

  @IsEnum(OtpType)
  @IsNotEmpty()
  otpType: OtpType;
}

export class SendPeerOtpDTO {
  @IsEnum(OtpType)
  @IsNotEmpty()
  otpType: OtpType;
}
