import { PeerFor } from '@models/peer.model';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

export class VerifictionByManagerDto {
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

  @ValidateNested()
  @Type(() => VerifictionByManagerDto)
  @IsNotEmpty()
  public verification_fields!: VerifictionByManagerDto;

  public workExperience!: string;
}

export class UpdatePeerDto {
  @ValidateNested()
  @Type(() => VerifictionByManagerDto)
  @IsNotEmpty()
  public verification_fields!: VerifictionByManagerDto;
}
