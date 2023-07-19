import { State, WorkVerificationBy } from '@models/peer.model';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateIf, ValidateNested } from 'class-validator';

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
  @ValidateNested()
  @Type(() => StatusField)
  @IsOptional()
  public candidateId?: StatusField;

  @ValidateNested()
  @Type(() => StatusField)
  @IsOptional()
  public salary?: StatusField;

  @IsString()
  @IsOptional()
  public review?: string;

  @IsString()
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
}

export function defaultWorkExFields() {
  const defaultStatus = new StatusField();
  defaultStatus.state = State.PENDING;

  const defaultValues: Partial<WorkExFieldsDTO> = {
    candidateId: defaultStatus,
    department: defaultStatus,
    dateOfJoining: defaultStatus,
    dateOfLeaving: defaultStatus,
    salary: defaultStatus,
    companyName: defaultStatus,
    workMode: defaultStatus,
    workType: defaultStatus,
    review: '',
  };
  return defaultValues;
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
  public verificationFields!: string[];
}

export class UpdatePeerWorkVerificationDto {
  @ValidateNested()
  @Type(() => WorkExFieldsDTO)
  @IsNotEmpty()
  public verificationFields!: WorkExFieldsDTO;
}
