import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum SkillTypeEnum {
  AMATEUR = 'AMATEUR',
  EXPERT = 'EXPERT',
  BEGINNER = 'BEGINNER',
  SUPER_SPECIALIST = 'SUPER_SPECIALIST',
  MASTER = 'MASTER',
  HIGHLY_COMPETENT = 'HIGHLY_COMPETENT',
}

export class CreateSkillDto {
  @IsString()
  @IsNotEmpty()
  public skillName!: string;

  @IsString()
  @IsOptional()
  public workExperience?: string;

  @IsEnum(SkillTypeEnum)
  @IsNotEmpty()
  public expertise!: SkillTypeEnum;
}
