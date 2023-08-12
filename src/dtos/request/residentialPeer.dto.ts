import { IsObjectId, sanitizeMobileNumber } from '@/utils/validation';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Validate } from 'class-validator';

export class CreateResidentialPeerDto {
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

  @IsString()
  @IsNotEmpty()
  @Validate(IsObjectId)
  public ref!: string;

  @IsString()
  @IsNotEmpty()
  public verificationBy!: string;
}
