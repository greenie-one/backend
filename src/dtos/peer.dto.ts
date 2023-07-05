import { DocumentType } from '@/models/document.model';
import { skillTypeEnum } from '@/models/skills.model';
import { PeerType, State } from '@models/peer.model';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

export class CreatePeerDto {
  @IsString()
  @IsNotEmpty()
  public name!: string;

  @IsString()
  @IsNotEmpty()
  public email!: string;

  @IsString()
  @IsNotEmpty()
  public phone!: string;

  @IsEnum(PeerType)
  @IsNotEmpty()
  public peerType!: PeerType;

  @IsString()
  @IsNotEmpty()
  public workExperience!: string;
}

export class SkillDto {
  @IsString()
  @IsNotEmpty()
  public skillName!: string;

  @IsEnum(skillTypeEnum)
  @IsNotEmpty()
  public expertise!: skillTypeEnum;

  @IsEnum(State)
  @IsNotEmpty()
  public state!: State;
}

export class DocumentDto {
  @IsString()
  @IsNotEmpty()
  public documentName!: string;

  @IsEnum(DocumentType)
  @IsNotEmpty()
  public documentType!: DocumentType;

  @IsEnum(State)
  @IsNotEmpty()
  public state!: State;
}

export class FieldDto {
  @IsNotEmpty()
  public value!: string;

  @IsEnum(State)
  @IsNotEmpty()
  public state!: State;
}

export class ExperienceDetailsDto {
  @ValidateNested()
  @Type(() => FieldDto)
  public candidateId!: FieldDto;

  @ValidateNested()
  @Type(() => FieldDto)
  public department!: FieldDto;

  @ValidateNested()
  @Type(() => FieldDto)
  public designation!: FieldDto;

  @ValidateNested()
  @Type(() => FieldDto)
  public dateOfJoining!: FieldDto;

  @ValidateNested()
  @Type(() => FieldDto)
  public dateOfLeaving!: FieldDto;
}

export class PeerVerificationResponse {
  @ValidateNested()
  @Type(() => CreatePeerDto)
  @IsNotEmpty()
  public peerDetails!: CreatePeerDto;

  @ValidateNested()
  @Type(() => ExperienceDetailsDto)
  @IsNotEmpty()
  public peerVerificationStatus!: ExperienceDetailsDto;

  @ValidateNested({ each: true })
  @Type(() => SkillDto)
  @IsOptional()
  public peerSkillStatus?: SkillDto[];

  @ValidateNested({ each: true })
  @Type(() => DocumentDto)
  @IsOptional()
  public peerDocumentStatus?: DocumentDto[];
}
