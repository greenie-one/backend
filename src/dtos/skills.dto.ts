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

export interface AddSkillResponse {
  id: string;
  success: boolean;
}

export interface SkillResponse {
  id: string;
  skillName: string;
  workExperience?: string;
  expertise: skillTypeEnum;
}

export interface GetSkillsResponse {
  skills: SkillResponse[];
}
