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
  public companyName!: string;

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
  public companyStartYear?: string;

  @IsString()
  @IsOptional()
  public companyEndYear?: string;

  @IsString()
  @IsNotEmpty()
  public user!: string;
}
