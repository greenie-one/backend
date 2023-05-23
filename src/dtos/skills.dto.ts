import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class createSkillDto {
  @IsString()
  @IsNotEmpty()
  public image: string;

  @IsString()
  @IsNotEmpty()
  public designation: string;

  @IsBoolean()
  public isVerified?: boolean;

  @IsNumber()
  @IsNotEmpty()
  public skillRate: number;

  @IsString()
  @IsNotEmpty()
  public user: string;
}
