import { SkillTypeEnum } from "../request/skills.dto";

export interface AddSkillResponse {
  id: string;
  success: boolean;
}

export interface SkillResponseDto {
  id: string;
  skillName: string;
  workExperience?: string;
  expertise: SkillTypeEnum;
}

export interface GetSkillsResponse {
  skills: SkillResponseDto[];
}

