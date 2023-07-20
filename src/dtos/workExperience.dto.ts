import { IsEnum, IsISO8601, IsNotEmpty, IsOptional, IsString } from 'class-validator';
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
  public dateOfJoining!: string;

  @IsOptional()
  @IsISO8601()
  public dateOfLeaving?: string;
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
  public dateOfJoining?: string;

  @IsString()
  @IsOptional()
  public linkedInUrl?: string;

  @IsISO8601()
  @IsOptional()
  public dateOfLeaving?: string;
}

export interface AddWorkExperienceResponse {
  id: string;
  success: boolean;
}

export interface workExperienceResponseDto {
  id: string;
  designation: string;
  companyType: companyTypeEnum;
  email: string;
  workMode: string;
  department: string;
  reason_for_leaving: string;
  salary: string;
  workType: string;
  companyName: string;
  companyId: string;
  dateOfJoining: string;
  linkedInUrl: string;
  dateOfLeaving: string;
  noOfVerifications: number;
}

export interface GetWorkExperienceResponse {
  workExperiences: workExperienceResponseDto[];
}
