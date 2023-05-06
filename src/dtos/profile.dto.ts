import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  public first_name: string;

  @IsString()
  @IsNotEmpty()
  public last_name: string;
}

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  public first_name?: string;

  @IsString()
  @IsOptional()
  public last_name?: string;

  @IsString()
  public greenie_id?: string;
}
