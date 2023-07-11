import { skillTypeEnum } from '@/models/skills.model';
import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

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

export class FieldDto {
  @IsString()
  @IsOptional()
  public skillId?: string;

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

export class GetSkillResponse {
  @ValidateNested({ each: true })
  @Type(() => FieldDto)
  @IsOptional()
  public skills?: FieldDto[];
}
