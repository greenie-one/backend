import { State } from '@/models/peer.model';
import { SharedThing, SharedWith } from '@/models/sharing.model';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { getDocumentResponseDto } from './document.dto';
import { skillResponseDto } from './skills.dto';

export class sharingDTO {
  @IsEnum(SharedThing)
  @IsNotEmpty()
  public thing!: SharedThing;

  public thingId!: string[];

  @IsString()
  public userId!: string;

  @IsEnum(SharedWith)
  @IsNotEmpty()
  public sharedWith!: SharedWith;
}

export class sharingUpdateStateDTO {
  @IsString()
  @IsNotEmpty()
  public sharingId: string;

  @IsEnum(State)
  @IsNotEmpty()
  public state: State;
}

export interface getSharedResponseDTO {
  id: string;

  state: State;

  data: skillResponseDto | getDocumentResponseDto;
}
