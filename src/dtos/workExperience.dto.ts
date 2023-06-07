import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { companyTypeEnum } from '../models/workExperience.model';

export class CreateWorkExperienceDto {
  @IsString()
  @IsOptional()
  public image?: string;

  @IsString()
  @IsNotEmpty()
  public designation!: string;

  @IsEnum(companyTypeEnum)
  @IsOptional()
  public companyType?: companyTypeEnum;

  @IsString()
  @IsNotEmpty()
  public email!: string;

  @IsString()
  @IsOptional()
  public workMode?: string;

  @IsString()
  @IsOptional()
  public workType?: string;

  @IsString()
  @IsNotEmpty()
  public companyName!: string;

  @IsString()
  @IsNotEmpty()
  public companyId!: string;

  @IsBoolean()
  @IsOptional()
  public isVerified?: boolean;

  @IsString()
  @IsOptional()
  public description?: string;

  @IsString()
  @IsOptional()
  public verifiedBy?: string;

  @IsString()
  @IsOptional()
  public companyStartDate?: string;

  @IsString()
  @IsOptional()
  public linkedInUrl?: string;

  @IsString()
  @IsOptional()
  public companyEndDate?: string;

  @IsString()
  @IsNotEmpty()
  public user!: string;
}

export class UpdateWorkExperienceDto {
  @IsString()
  @IsOptional()
  public image?: string;

  @IsString()
  @IsOptional()
  public designation?: string;

  @IsString()
  @IsOptional()
  public email?: string;

  @IsEnum(companyTypeEnum)
  @IsOptional()
  public companyType?: companyTypeEnum;

  @IsString()
  @IsOptional()
  public workMode?: string;

  @IsString()
  @IsOptional()
  public workType?: string;

  @IsString()
  @IsOptional()
  public companyName?: string;

  @IsString()
  @IsOptional()
  public companyId?: string;

  @IsBoolean()
  @IsOptional()
  public isVerified?: boolean;

  @IsString()
  @IsOptional()
  public description?: string;

  @IsString()
  @IsOptional()
  public verifiedBy?: string;

  @IsString()
  @IsOptional()
  public companyStartDate?: string;

  @IsString()
  @IsOptional()
  public companyEndDate?: string;
}
