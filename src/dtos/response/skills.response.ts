import { SkillTypeEnum } from '../request/skills.dto';

export type CreateSkillResponse = SkillResponse;

export interface SkillResponse {
  id: string;
  skillName: string;
  workExperience?: string;
  expertise: SkillTypeEnum;
}

export type GetSkillsResponse = SkillResponse[];

export type DeleteSkillResponse = Record<string, never>

export type UpdateSkillResponse = SkillResponse
