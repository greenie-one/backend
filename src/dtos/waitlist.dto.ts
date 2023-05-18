import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddToWaitlistDto {
  @IsString()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsOptional()
  public phoneNumber?: string;
}
