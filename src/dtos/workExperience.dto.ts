import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateWorkExperienceDto {
  @IsString()
  @IsNotEmpty()
  public image: string;

  @IsString()
  @IsNotEmpty()
  public designation: string;

  @IsString()
  @IsNotEmpty()
  public companyName: string;

  @IsBoolean()
  public isVerified?: boolean;

  @IsString()
  public description?: string;

  @IsString()
  @IsOptional()
  public verifiedBy?: string;

  @IsString()
  public companyStartYear?: string;

  @IsString()
  public companyEndYear?: string;

  @IsString()
  @IsNotEmpty()
  public user: string;
}
