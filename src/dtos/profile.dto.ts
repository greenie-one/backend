import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

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

export class AddProfileResponse {
  @IsString()
  @IsOptional()
  public profileId?: string;

  @IsBoolean()
  @IsOptional()
  public success?: boolean;
}

export class GetProfileResponse {
  @IsString()
  @IsOptional()
  public profileId?: string;

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
  public descriptionTags: string[];
}

export class GetSearchedProfilesResponse {
  @ValidateNested({ each: true })
  @Type(() => GetProfileResponse)
  @IsOptional()
  public profiles?: GetProfileResponse[];
}
