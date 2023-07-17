import { otpType } from '@/remote/otp/otp';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class VerifyOtpDTO {
  @IsString()
  @IsNotEmpty()
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
