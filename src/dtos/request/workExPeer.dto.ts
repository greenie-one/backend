import { IsObjectId, sanitizeMobileNumber } from '@/utils/validation';
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
  ValidatorConstraint,
  ValidatorConstraintInterface,
  validate
} from 'class-validator';

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

  @ValidateNested()
  @Type(() => StatusField)
  @IsOptional()
  public companyId?: StatusField;
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
  @IsOptional()
  public exitProcedure?: StatusField;

  @ValidateNested()
  @Type(() => StatusField)
  @IsOptional()
  public eligibleForRehire?: StatusField;


  @ValidateNested()
  @Type(() => StatusField)
  @IsOptional()
  public onNotice?: StatusField;
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
  @Validate(IsObjectId)
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
  @Validate(IsObjectId, { each: true })
  public skills!: string[];

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  @Validate(IsObjectId, { each: true })
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
  async validate(otherQuestions) {
    let valid = false;
    const tryOne = plainToInstance<unknown, object>(HRQuestionsDTO, otherQuestions);
    await validate(tryOne, { whitelist: true, forbidNonWhitelisted: true }).then((errors) => {
      if (errors.length === 0) valid = true;
    });
    return valid;
  }

  defaultMessage() {
    return `'otherQuestions' must be either HRQuestionFieldsDTO or ExceptHRQuestionFieldsDTO`;
  }
}

export class UpdatePeerWorkVerificationDto {
  @ValidateNested()
  @Type(() => SelectedFieldsDTO)
  @IsOptional()
  public selectedFields?: SelectedFieldsDTO;

  @ValidateNested()
  @Type(() => StatusField)
  @IsNotEmpty()
  public isReal!: StatusField;

  @ValidateNested()
  @Type(() => AllQuestionsDTO)
  @IsOptional()
  public allQuestions!: AllQuestionsDTO;

  @Validate(IsValidNestedQuestion)
  @IsOptional()
  public otherQuestions?: HRQuestionsDTO;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateSkillsVerification)
  @IsNotEmpty()
  @IsOptional()
  public skills!: UpdateSkillsVerification[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateDocumentsVerification)
  @IsNotEmpty()
  @IsOptional()
  public documents!: UpdateDocumentsVerification[];
}
