import { sanitizeMobileNumber } from '@/utils/validation';
import { Transform, Type } from 'class-transformer';

// rome-ignore format: Imports need to be remove and i'm too lazy to write a multi-line import removal regex
import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, ValidateIf, ValidateNested } from "class-validator";

export enum OtpType {
  EMAIL = 'EMAIL',
  MOBILE = 'MOBILE',
}

export class VerifyOtpDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(6)
  otp: string;

  @IsEnum(OtpType)
  @IsNotEmpty()
  otpType: OtpType;
}

export class SendPeerOtpDTO {
  @IsEnum(OtpType)
  @IsNotEmpty()
  otpType: OtpType;
}

export enum WorkVerificationBy {
  COLLEAGUE = 'COLLEAGUE',
  REPORTING_MANAGER = 'REPORTING_MANAGER',
  LINE_MANAGER = 'LINE_MANAGER',
  HR = 'HR',
  CXO = 'CXO',
}

export enum Rating {
  NON_COLLABORATIVE = 'non-collaborative',
  RARELY_COLLABORATIVE = 'rarely-collaborative',
  OCCASIONALLY_COLLABORATIVE = 'occasionally-collaborative',
  MODERATELY_COLLABORATIVE = 'moderately-collaborative',
  HIGHLY_COLLABORATIVE = 'highly-collaborative',
  NOT_GIVEN = 'not-given',
}

export enum State {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export class StatusField {
  @IsString()
  @IsNotEmpty()
  @IsEnum(State)
  public state!: State.ACCEPTED | State.REJECTED;

  @IsString()
  @ValidateIf((o) => o.state === State.REJECTED)
  @IsNotEmpty()
  public dispute_type?: string;

  @IsString()
  @ValidateIf((o) => o.state === State.REJECTED)
  @IsNotEmpty()
  public dispute_reason?: string;
}

export class SelectedFieldsDTO {
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
}

export class AllQuestionsDTO {
  // From Work Ex Mandatory Questions
  @IsEnum(Rating)
  @IsNotEmpty()
  public attitudeRating!:
    | Rating.HIGHLY_COLLABORATIVE
    | Rating.MODERATELY_COLLABORATIVE
    | Rating.NON_COLLABORATIVE
    | Rating.OCCASIONALLY_COLLABORATIVE
    | Rating.RARELY_COLLABORATIVE;

  @ValidateNested()
  @Type(() => StatusField)
  @IsNotEmpty()
  public peerPost!: StatusField;

  @IsString()
  @IsNotEmpty()
  public review!: string;

  @ValidateNested()
  @Type(() => StatusField)
  @IsNotEmpty()
  public designation!: StatusField;
}

export class HRQuestionsDTO {
  // From Work Ex HR Questions
  @ValidateNested()
  @Type(() => StatusField)
  @IsNotEmpty()
  public exitProcedure!: StatusField;

  @ValidateNested()
  @Type(() => StatusField)
  @IsNotEmpty()
  public eligibleForRehire!: StatusField;
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
  public selectedFields!: string[];

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  public skills!: string[];

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  public documents!: string[];
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
  @Type(() => SelectedFieldsDTO)
  @IsOptional()
  public selectedFields?: SelectedFieldsDTO;

  @ValidateNested()
  @Type(() => AllQuestionsDTO)
  @IsNotEmpty()
  public allQuestions!: AllQuestionsDTO;

  @ValidateNested()
  @IsOptional()
  @Type(() => HRQuestionsDTO)
  public otherQuestions?: HRQuestionsDTO;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateSkillsVerification)
  @IsNotEmpty()
  public skills!: UpdateSkillsVerification[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateDocumentsVerification)
  @IsNotEmpty()
  public documents!: UpdateDocumentsVerification[];
}
