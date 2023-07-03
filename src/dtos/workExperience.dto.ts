import { IsEnum, IsISO8601, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { companyTypeEnum } from '../models/workExperience.model';

export class CreateWorkExperienceDto {
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

  @IsString()
  @IsOptional()
  public description?: string;

  @IsISO8601()
  @IsOptional()
  public companyStartDate?: string;

  @IsISO8601()
  @IsOptional()
  public linkedInUrl?: string;

  @IsISO8601()
  @IsOptional()
  public companyEndDate?: string;
}

export class UpdateWorkExperienceDto {
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

  @IsString()
  @IsOptional()
  public description?: string;

  @IsISO8601()
  @IsOptional()
  public companyStartDate?: string;

  @IsISO8601()
  @IsOptional()
  public companyEndDate?: string;
}
