import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateWorkExperienceDto {
  @IsString()
  @IsOptional()
  public image?: string;

  @IsString()
  @IsNotEmpty()
  public designation!: string;

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
  public companyEndDate?: string;

  @IsString()
  @IsNotEmpty()
  public user!: string;
}
