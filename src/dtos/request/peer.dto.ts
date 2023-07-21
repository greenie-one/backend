import {
  ExceptHRQuestionFields,
  HRQuestionFields,
  MandatoryQuestionFields,
  MandatoryWorkExFields,
  OptionalWorkExperienceFields,
} from '@/models/peer.model';
import { sanitizeMobileNumber } from '@/utils/validation';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateIf, ValidateNested } from 'class-validator';
import { GetDocumentResponse } from '../response/document.response';
import { SkillResponse } from '../response/skills.response';
import { WorkExperienceResponse } from '../response/workExperience.response';

export enum State {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export enum Rating {
  NON_COLLABORATIVE = 'non-collaborative',
  RARELY_COLLABORATIVE = 'rarely-collaborative',
  OCCASIONALLY_COLLABORATIVE = 'occasionally-collaborative',
  MODERATELY_COLLABORATIVE = 'moderately-collaborative',
  HIGHLY_COLLABORATIVE = 'highly-collaborative',
  NOT_GIVEN = 'not-given',
}

export enum WorkVerificationBy {
  COLLEAGUE = 'COLLEAGUE',
  REPORTING_MANAGER = 'REPORTING_MANAGER',
  LINE_MANAGER = 'LINE_MANAGER',
  HR = 'HR',
  CXO = 'CXO',
}

enum UpdateSate {
  REJECTED = 'REJECTED',
  APPROVED = 'APPROVED',
}

enum UpdateRating {
  NON_COLLABORATIVE = 'non-collaborative',
  RARELY_COLLABORATIVE = 'rarely-collaborative',
  OCCASIONALLY_COLLABORATIVE = 'occasionally-collaborative',
  MODERATELY_COLLABORATIVE = 'moderately-collaborative',
  HIGHLY_COLLABORATIVE = 'highly-collaborative',
}

export class StatusField {
  @IsString()
  @IsNotEmpty()
  @IsEnum(State)
  public state!: UpdateSate;

  @IsString()
  @IsOptional()
  @ValidateIf((o) => o.state === State.REJECTED)
  public dispute_type?: string;

  @IsString()
  @IsOptional()
  @ValidateIf((o) => o.state === State.REJECTED)
  public dispute_description?: string;
}

export class WorkExperienceFieldsDto {
  // From Work Ex Optional fields
  @ValidateNested()
  @Type(() => StatusField)
  @IsOptional()
  public candidateId?: StatusField;

  @ValidateNested()
  @Type(() => StatusField)
  @IsOptional()
  public department?: StatusField;

  @ValidateNested()
  @Type(() => StatusField)
  @IsOptional()
  public dateOfJoining?: StatusField;

  @ValidateNested()
  @Type(() => StatusField)
  @IsOptional()
  public dateOfLeaving?: StatusField;

  @ValidateNested()
  @Type(() => StatusField)
  @IsOptional()
  public companyName?: StatusField;

  @ValidateNested()
  @Type(() => StatusField)
  @IsOptional()
  public workType?: StatusField;

  @ValidateNested()
  @Type(() => StatusField)
  @IsOptional()
  public workMode?: StatusField;

  @ValidateNested()
  @Type(() => StatusField)
  @IsOptional()
  public salary?: StatusField;

  // From Work Ex Mandatory fields
  @IsString()
  public review: string;

  // From Work Ex Mandatory Questions
  @IsEnum(Rating)
  @IsOptional()
  public attitudeRating?: UpdateRating;

  @ValidateNested()
  @Type(() => StatusField)
  @IsOptional()
  public eligibleForRehire?: StatusField;

  // From Work Ex HR Questions
  @ValidateNested()
  @Type(() => StatusField)
  @IsOptional()
  public exitProcedure?: StatusField;

  // From Work Ex Except HR Questions
  @ValidateNested()
  @Type(() => StatusField)
  @IsOptional()
  public designation?: StatusField;

  @ValidateNested()
  @Type(() => StatusField)
  @IsOptional()
  public peerPost?: StatusField;
}

export class CreateWorkPeerDto {
  @IsString()
  @IsNotEmpty()
  public name!: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  public email!: string;

  @IsString()
  @IsNotEmpty()
  @Transform((params) => sanitizeMobileNumber(params.value))
  public phone!: string;

  @IsString()
  @IsNotEmpty()
  public ref!: string;

  @IsString()
  @IsEnum(WorkVerificationBy)
  @IsNotEmpty()
  public verificationBy!: WorkVerificationBy;

  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  public optionalVerificationFields!: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  public skills?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  public documents?: string[];
}

class UpdateSkillsVerification {
  @IsString()
  @IsNotEmpty()
  public id!: string;

  @ValidateNested()
  @Type(() => StatusField)
  @IsNotEmpty()
  public status!: StatusField;
}

class UpdateDocumentsVerification {
  @IsString()
  @IsNotEmpty()
  public id!: string;

  @ValidateNested()
  @Type(() => StatusField)
  @IsNotEmpty()
  public status!: StatusField;
}

export class UpdatePeerWorkVerificationDto {
  @ValidateNested()
  @Type(() => WorkExperienceFieldsDto)
  @IsNotEmpty()
  public verificationFields!: WorkExperienceFieldsDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateSkillsVerification)
  public skills?: UpdateSkillsVerification[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateDocumentsVerification)
  public documents?: UpdateDocumentsVerification[];
}

export interface CreateWorkPeerResponse {
  id: string;
  name: string;
}

export interface GetUserWorkPeerResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  workExperience: string;
  isVerificationCompleted: boolean;
}

export interface GetWorkExDataResponse extends Partial<WorkExperienceResponse> {
  name: string;
  profilePic: string;
  peerPost?: string;
  skills?: SkillResponse[];
  documents?: GetDocumentResponse[];
}

export interface GetPeerInformationResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  verificationBy: WorkVerificationBy;
  optionalVerificationFields?: OptionalWorkExperienceFields;
  mandatoryVerificationFields?: MandatoryWorkExFields;
  mandatoryQuestionFields?: MandatoryQuestionFields;
  otherQuestionFields: HRQuestionFields | ExceptHRQuestionFields;
  data: GetWorkExDataResponse;
}

