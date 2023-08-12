import { sanitizeMobileNumber } from '@/utils/validation';
import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsString, Matches, ValidateIf } from 'class-validator';

export class AddToWaitlistDto {
  @IsString()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @Matches(/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/)
  @ValidateIf((obj, val) => val || !obj.email)
  @Type(() => String)
  @Transform((params) => sanitizeMobileNumber(params.value))
  public phoneNumber?: string;
}
