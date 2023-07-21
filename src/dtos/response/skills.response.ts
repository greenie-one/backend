import { skillTypeEnum } from '@/models/skills.model';

export interface AddSkillResponse {
  id: string;
  success: boolean;
}

export interface SkillResponseDto {
  id: string;
  skillName: string;
  workExperience?: string;
  expertise: skillTypeEnum;
}

export interface GetSkillsResponse {
  skills: SkillResponseDto[];
}

