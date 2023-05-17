import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  public firstName: string;

  @IsString()
  @IsNotEmpty()
  public lastName: string;

  @IsArray()
  @IsString({ each: true })
  public descriptionTags: string[];
}

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  public firstName?: string;

  @IsString()
  @IsOptional()
  public lastName?: string;

  @IsString()
  public greenieId?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  public descriptionTags: string[];
}
