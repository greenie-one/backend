import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsISO8601, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { companyTypeEnum } from '../models/workExperience.model';

export class CreateWorkExperienceDto {
  @IsString()
  @IsNotEmpty()
  public designation!: string;

  @IsEnum(companyTypeEnum)
  @IsNotEmpty()
  public companyType!: companyTypeEnum;

  @IsString()
  @IsNotEmpty()
  public email!: string;

  @IsString()
  @IsOptional()
  public workMode?: string;

  @IsString()
  @IsNotEmpty()
  public department!: string;

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
  public linkedInUrl?: string;

  @IsString()
  @IsOptional()
  public reason_for_leaving?: string;

  @IsString()
  @IsOptional()
  public salary?: string;

  @IsISO8601()
  @IsNotEmpty()
  public companyStartDate!: string;

  @IsISO8601()
  @IsOptional()
  public companyEndDate?: string;
}

export class UpdateWorkExperienceDto {
  @IsString()
  @IsOptional()
  public designation?: string;

  @IsEnum(companyTypeEnum)
  @IsOptional()
  public companyType?: companyTypeEnum;

  @IsString()
  @IsOptional()
  public email?: string;

  @IsString()
  @IsOptional()
  public workMode?: string;

  @IsString()
  @IsOptional()
  public department?: string;

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
  public reason_for_leaving?: string;

  @IsString()
  @IsOptional()
  public salary?: string;

  @IsISO8601()
  @IsOptional()
  public companyStartDate?: string;

  @IsString()
  @IsOptional()
  public linkedInUrl?: string;

  @IsISO8601()
  @IsOptional()
  public companyEndDate?: string;
}

export class AddWorkExperienceResponse {
  @IsString()
  @IsOptional()
  public workExperienceId?: string;

  @IsBoolean()
  @IsOptional()
  public success?: boolean;
}

export class FieldDto {
  @IsString()
  @IsNotEmpty()
  public workExpId!: string;

  @IsString()
  @IsNotEmpty()
  public designation!: string;

  @IsEnum(companyTypeEnum)
  @IsNotEmpty()
  public companyType!: companyTypeEnum;

  @IsString()
  @IsNotEmpty()
  public email!: string;

  @IsString()
  @IsOptional()
  public workMode?: string;

  @IsString()
  @IsOptional()
  public department?: string;

  @IsString()
  @IsOptional()
  public reason_for_leaving?: string;

  @IsString()
  @IsOptional()
  public salary?: string;

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
  @IsNotEmpty()
  public companyStartDate!: string;

  @IsString()
  @IsOptional()
  public linkedInUrl?: string;

  @IsISO8601()
  @IsOptional()
  public companyEndDate?: string;
}

export class GetWorkExperienceResponse {
  @ValidateNested({ each: true })
  @Type(() => FieldDto)
  @IsOptional()
  public workExperinces?: FieldDto[];
}
