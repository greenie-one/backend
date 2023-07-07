import { skillTypeEnum } from '@/models/skills.model';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class createSkillDto {
  @IsString()
  @IsNotEmpty()
  public skillName!: string;

  @IsString()
  @IsOptional()
  public workExperience?: Types.ObjectId;

  @IsEnum(skillTypeEnum)
  @IsNotEmpty()
  public expertise!: skillTypeEnum;
}
