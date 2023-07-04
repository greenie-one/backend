import { PeerType, State } from '@models/peer.model';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

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

  @IsEnum(PeerType)
  @IsNotEmpty()
  public peerType!: PeerType;

  @IsString()
  @IsNotEmpty()
  public workExperience!: string;
}

export class PeerSkillVerificationDto {
  @IsEnum(State)
  @IsNotEmpty()
  public state!: State;
}
