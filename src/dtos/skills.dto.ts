import { skillTypeEnum } from '@/models/skills.model';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class createSkillDto {
  @IsString()
  @IsNotEmpty()
  public skillName!: string;

  @IsString()
  @IsOptional()
  public workExperience?: string;

  @IsEnum(skillTypeEnum)
  @IsNotEmpty()
  public expertise!: skillTypeEnum;
}
