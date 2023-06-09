import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class createSkillDto {
  @IsString()
  @IsNotEmpty()
  public designation!: string;

  @IsBoolean()
  @IsOptional()
  public isVerified?: boolean;

  @IsNumber()
  @IsNotEmpty()
  public skillRate!: number;
}

export class updateSkillDto {
  @IsString()
  @IsOptional()
  public designation?: string;

  @IsBoolean()
  @IsOptional()
  public isVerified?: boolean;

  @IsNumber()
  @IsOptional()
  public skillRate?: number;
}
