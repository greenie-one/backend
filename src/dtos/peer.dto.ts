import { State, WorkVerificationBy } from '@models/peer.model';
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
  public verification_by!: WorkVerificationBy;

  @ValidateNested()
  @Type(() => WorkExFieldsDTO)
  @IsNotEmpty()
  public verification_fields!: WorkExFieldsDTO;
}

export class UpdatePeerWorkVerificationDto {
  @ValidateNested()
  @Type(() => WorkExFieldsDTO)
  @IsNotEmpty()
  public verification_fields!: WorkExFieldsDTO;
}
