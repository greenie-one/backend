import { State } from '@/models/peer.model';
import { SharedThing, SharedWith } from '@/models/sharing.model';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class SharingDTO {
  @IsEnum(SharedThing)
  @IsNotEmpty()
  public thing!: SharedThing;

  public thingId!: string[];

  @IsString()
  public sharedWithId!: string;

  @IsEnum(SharedWith)
  @IsNotEmpty()
  public sharedWith!: SharedWith;
}

export class SharingUpdateStateDTO {
  @IsString()
  @IsNotEmpty()
  public sharingId: string;

  @IsEnum(State)
  @IsNotEmpty()
  public state: State;
}

