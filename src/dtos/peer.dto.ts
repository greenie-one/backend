import { Rating, State, WorkVerificationBy } from '@models/peer.model';
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
  public peerPost?: StatusField;

  @ValidateNested()
  @Type(() => StatusField)
  @IsOptional()
  public salary?: StatusField;

  @IsOptional()
  @IsEnum(Rating)
  public attitudeRating?: Rating;

  @ValidateNested()
  @Type(() => StatusField)
  @IsOptional()
  public eligibleForRehire?: StatusField;

  @ValidateNested()
  @Type(() => StatusField)
  @IsOptional()
  public exitStatusField?: StatusField;

  @IsString()
  @IsOptional()
  public review?: string;

  @IsString()
  @IsOptional()
  public department?: StatusField;

  @ValidateNested()
  @Type(() => StatusField)
  @IsOptional()
  public designation?: StatusField;

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
