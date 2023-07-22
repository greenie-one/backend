import { IsEnum, IsISO8601, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum CompanyTypeEnum {
  Startup = 'Start-up (Funded)',
  EarlyStageStartup = 'Early Stage Startup',
  ProfitableStartup = 'Startup (Profitable)',
  FamilyOwnedBusiness = 'Family Owned Business',
  PrivateLimitedIndia = 'Private Limited (India)',
  PartnershipLLP = 'Partnership (LLP/LLC)',
  PublicLimitedCompany = 'Public Limited Company',
}

export class CreateWorkExperienceDto {
  @IsString()
  @IsNotEmpty()
  public designation!: string;

  @IsEnum(CompanyTypeEnum)
  @IsNotEmpty()
  public companyType!: CompanyTypeEnum;

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

  @IsEnum(CompanyTypeEnum)
  @IsOptional()
  public companyType?: CompanyTypeEnum;

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
