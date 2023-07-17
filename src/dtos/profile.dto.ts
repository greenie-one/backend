import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  public firstName!: string;

  @IsString()
  @IsNotEmpty()
  public lastName!: string;

  @IsString()
  @IsOptional()
  public bio?: string;

  @IsString()
  @IsOptional()
  public profilePic?: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  public descriptionTags?: string[];
}

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  public firstName?: string;

  @IsString()
  @IsOptional()
  public lastName?: string;

  @IsString()
  @IsOptional()
  public profilePic?: string;

  @IsString()
  @IsOptional()
  public bio?: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  public descriptionTags?: string[];
}

export interface AddProfileResponse {
  id: string;
  success: boolean;
}

export interface profileResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  bio: string;
  profilePic: string;
  descriptionTags: string[];
}

export interface GetProfileResponse {
  profiles: profileResponseDto[];
}
