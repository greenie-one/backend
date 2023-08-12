import { sanitizeMobileNumber } from '@/utils/validation';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class addUserInfoDTO {
  @IsString()
  @IsNotEmpty()
  public name!: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  public email!: string;

  @IsString()
  @IsNotEmpty()
  @Transform((params) => sanitizeMobileNumber(params.value))
  public phone!: string;

}
