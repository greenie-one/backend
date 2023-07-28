import { IsObjectId } from '@/utils/validation';
import { IsEnum, IsNotEmpty, IsOptional, IsString, Validate } from 'class-validator';

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
  @Validate(IsObjectId)
  @IsOptional()
  public workExperience?: string;

  @IsEnum(SkillTypeEnum)
  @IsNotEmpty()
  public expertise!: SkillTypeEnum;
}

export class UpdateSkillDto {
  @IsString()
  @IsOptional()
  public skillName?: string;

  @IsString()
  @Validate(IsObjectId)
  @IsOptional()
  public workExperience?: string;

  @IsEnum(SkillTypeEnum)
  @IsOptional()
  public expertise?: SkillTypeEnum;
}
