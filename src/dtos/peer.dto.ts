import {
  ExceptHRQuestionFields,
  HRQuestionFields,
  MandatoryQuestionFields,
  MandatoryWorkExFields,
  OptionalWorkExFields,
  Rating,
  State,
  WorkVerificationBy,
} from '@models/peer.model';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateIf, ValidateNested } from 'class-validator';
import { workExperienceResponseDto } from './workExperience.dto';

class StatusField {
  @IsString()
  @IsNotEmpty()
  @IsEnum(State)
  public state!: State;

  @IsString()
  @IsOptional()
  @ValidateIf((o) => o.state === State.REJECTED)
  public dispute_type?: string;

  @IsString()
  @IsOptional()
  @ValidateIf((o) => o.state === State.REJECTED)
  public dispute_description?: string;
}

export class WorkExFieldsDTO {
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
  @IsOptional()
  public review?: string;

  // From Work Ex Mandatory Questions
  @IsEnum(Rating)
  @IsOptional()
  public attitudeRating?: Rating;

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
  public email!: string;

  @IsString()
  @IsNotEmpty()
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
}

export class UpdatePeerWorkVerificationDto {
  @ValidateNested()
  @Type(() => WorkExFieldsDTO)
  @IsNotEmpty()
  public verificationFields!: WorkExFieldsDTO;
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
}

export interface GetWorkExDataResponse extends Partial<workExperienceResponseDto> {
  name: string;
  profilePic: string;
  peerPost?: string;
}

export interface GetPeerInformationResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  verificationBy: WorkVerificationBy;
  optionalVerificationFields?: OptionalWorkExFields;
  mandatoryVerificationFields?: MandatoryWorkExFields;
  mandatoryQuestionFields?: MandatoryQuestionFields;
  otherQuestionFields: HRQuestionFields | ExceptHRQuestionFields;
  data: GetWorkExDataResponse;
}
