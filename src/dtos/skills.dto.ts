import { skillTypeEnum } from '@/models/skills.model';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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

export class AddSkillResponse {
  @IsString()
  @IsOptional()
  public skillId?: string;

  @IsBoolean()
  @IsOptional()
  public success?: boolean;
}

export interface skillResponseDto {
  id: string;
  skillName: string;
  workExperience?: string;
  expertise: skillTypeEnum;
}

export interface GetSkillsResponse {
  skills: skillResponseDto[];
}
