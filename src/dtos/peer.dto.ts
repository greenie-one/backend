import { sanitizeMobileNumber } from '@/utils/validation';
import { Rating, State, WorkVerificationBy } from '@models/peer.model';
import { Transform, Type, plainToInstance } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
  ValidateIf,
  ValidateNested,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  validate,
} from 'class-validator';
import { GetDocumentResponse } from './document.dto';
import { SkillResponse } from './skills.dto';
import { workExperienceResponseDto } from './workExperience.dto';

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

export class OptionalWorkExFieldsDTO {
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

export class MandatoryWorkExFieldsDTO {
  // From Work Ex Mandatory fields
  @IsString()
  @IsNotEmpty()
  public review!: string;
}

export class MandatoryQuestionsDTO {
  // From Work Ex Mandatory Questions
  @IsEnum(Rating)
  @IsNotEmpty()
  public attitudeRating!:
    | Rating.HIGHLY_COLLABORATIVE
    | Rating.MODERATELY_COLLABORATIVE
    | Rating.NOT_GIVEN
    | Rating.NON_COLLABORATIVE
    | Rating.OCCASIONALLY_COLLABORATIVE
    | Rating.RARELY_COLLABORATIVE;

  @ValidateNested()
  @Type(() => StatusField)
  @IsNotEmpty()
  public eligibleForRehire!: StatusField;
}

export class HRQuestionFieldsDTO {
  // From Work Ex HR Questions
  @ValidateNested()
  @Type(() => StatusField)
  @IsNotEmpty()
  public exitProcedure!: StatusField;
}

export class ExceptHRQuestionFieldsDTO {
  // From Work Ex Except HR Questions
  @ValidateNested()
  @Type(() => StatusField)
  @IsNotEmpty()
  public designation!: StatusField;

  @ValidateNested()
  @Type(() => StatusField)
  @IsNotEmpty()
  public peerPost!: StatusField;
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

@ValidatorConstraint({ name: 'isValidNestedQuestion', async: false })
export class IsValidNestedQuestion implements ValidatorConstraintInterface {
  async validate(otherQuestions: any, args: ValidationArguments) {
    console.log(otherQuestions);
    let valid = false;
    let tryOne = plainToInstance<unknown, object>(HRQuestionFieldsDTO, otherQuestions);
    await validate(tryOne).then((errors) => {
      if (errors.length === 0) valid = true;
    });
    console.log(valid);
    console.log(tryOne);
    if (valid) return true;
    let tryTwo = plainToInstance<unknown, object>(ExceptHRQuestionFieldsDTO, otherQuestions);
    await validate(tryTwo).then((errors) => {
      if (errors.length === 0) valid = true;
    }),
      console.log(valid);
    console.log(tryTwo);
    console.log(otherQuestions instanceof ExceptHRQuestionFieldsDTO);
    if (valid) return true;
    return false;
  }

  defaultMessage(args: ValidationArguments) {
    return `'otherQuestions' must be either HRQuestionFieldsDTO or ExceptHRQuestionFieldsDTO`;
  }
}

export class UpdatePeerWorkVerificationDto {
  @ValidateNested()
  @Type(() => OptionalWorkExFieldsDTO)
  @IsOptional()
  public optionalVerificationFields?: OptionalWorkExFieldsDTO;

  @ValidateNested()
  @Type(() => MandatoryWorkExFieldsDTO)
  @IsNotEmpty()
  public mandatoryVerificationFields!: MandatoryWorkExFieldsDTO;

  @ValidateNested()
  @Type(() => MandatoryQuestionsDTO)
  @IsNotEmpty()
  public mandatoryQuestions!: MandatoryQuestionsDTO;

  @Validate(IsValidNestedQuestion)
  @IsNotEmpty()
  public otherQuestions!: HRQuestionFieldsDTO | ExceptHRQuestionFieldsDTO;

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

export interface GetWorkExDataResponse {
  name: string;
  profilePic: string;
  peerPost?: string;
  designation?: string;
  optionalVerificationFields?: Partial<workExperienceResponseDto>;
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
  data: GetWorkExDataResponse;
  dateOfJoining: string;
  dateOfLeaving?: string;
}
