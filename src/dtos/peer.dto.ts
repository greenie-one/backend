import { Bool, Rating, State, WorkVerificationBy } from '@models/peer.model';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

export class WorkExFieldsDTO {
  @IsString()
  @IsOptional()
  @IsEnum(State)
  public candidateId?: State;

  @IsString()
  @IsOptional()
  @IsEnum(State)
  public peerPost?: State;

  @IsString()
  @IsOptional()
  @IsEnum(State)
  public salary?: State;

  @IsString()
  @IsOptional()
  @IsEnum(Rating)
  public attitudeRating?: Rating;

  @IsString()
  @IsOptional()
  @IsEnum(Bool)
  public eligibleForRehire?: Bool;

  @IsString()
  @IsOptional()
  @IsEnum(Bool)
  public exitStatus?: Bool;

  @IsString()
  @IsOptional()
  public review?: string;

  @IsString()
  @IsOptional()
  @IsEnum(State)
  public department?: State;

  @IsString()
  @IsOptional()
  @IsEnum(State)
  public designation?: State;

  @IsString()
  @IsOptional()
  @IsEnum(State)
  public dateOfJoining?: State;

  @IsString()
  @IsOptional()
  @IsEnum(State)
  public dateOfLeaving?: State;
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

  @ValidateNested()
  @Type(() => WorkExFieldsDTO)
  @IsNotEmpty()
  public verificationFields!: WorkExFieldsDTO;
}

export class UpdatePeerWorkVerificationDto {
  @ValidateNested()
  @Type(() => WorkExFieldsDTO)
  @IsNotEmpty()
  public verificationFields!: WorkExFieldsDTO;
}
