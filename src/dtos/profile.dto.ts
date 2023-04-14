import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  public first_name: string;

  @IsString()
  @IsNotEmpty()
  public last_name: string;

  @IsString()
  @IsNotEmpty()
  public phone: string;
}

export class UpdateProfileDto {
  @IsString()
  public first_name?: string;

  @IsString()
  public last_name?: string;

  @IsString()
  public phone?: string;
}
