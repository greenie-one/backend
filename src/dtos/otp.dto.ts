import { otpType } from '@/remote/otp/otp';
import { IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class VerifyOtpDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(6)
  otp: string;

  @IsEnum(otpType)
  @IsNotEmpty()
  otpType: otpType;
}

export class SendPeerOtpDTO {
  @IsEnum(otpType)
  @IsNotEmpty()
  otpType: otpType;
}
