import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class createSkillDto {
  @IsString()
  @IsOptional()
  public image?: string;

  @IsString()
  @IsNotEmpty()
  public designation!: string;

  @IsBoolean()
  @IsOptional()
  public isVerified?: boolean;

  @IsNumber()
  @IsNotEmpty()
  public skillRate!: number;

  @IsString()
  @IsNotEmpty()
  public user!: string;
}
