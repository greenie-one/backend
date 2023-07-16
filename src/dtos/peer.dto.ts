import { PeerFor } from '@models/peer.model';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString, ValidateIf, ValidateNested } from 'class-validator';

export class WorkExFieldsDTO {
  @IsString()
  @IsOptional()
  public candidateId?: string;

  @IsString()
  @IsOptional()
  public department?: string;

  @IsString()
  @IsOptional()
  public designation?: string;

  @IsString()
  @IsOptional()
  public dateOfJoining?: string;

  @IsString()
  @IsOptional()
  public dateOfLeaving?: string;
}

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

  @IsString()
  @IsNotEmpty()
  public peerForRef!: string;

  @IsString()
  @IsNotEmpty()
  public verification_by!: string;

  @IsEnum(PeerFor)
  @IsNotEmpty()
  public peerFor!: PeerFor;

  @ValidateIf((o) => o.peerFor === PeerFor.WORKEXPERIENCE)
  @ValidateNested()
  @Type(() => WorkExFieldsDTO)
  @IsNotEmpty()
  public verification_fields?: WorkExFieldsDTO;
}

export class UpdatePeerWorkVerificationDto {
  @ValidateNested()
  @Type(() => WorkExFieldsDTO)
  @IsNotEmpty()
  public verification_fields!: WorkExFieldsDTO;
}
