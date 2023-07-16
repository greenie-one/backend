import { State } from '@/models/peer.model';
import { SharedThing, SharedWith } from '@/models/sharing.model';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class sharingDTO {
  @IsEnum(SharedThing)
  @IsNotEmpty()
  public thing!: SharedThing;

  public thingId!: [];

  @IsString()
  public userId!: string;

  @IsEnum(SharedWith)
  @IsNotEmpty()
  public sharedWith!: SharedWith;
}

export class getSharingThings {
  @IsString()
  public id!: string;

  @IsString()
  public data!: string;
}
export class sharingUpdateStateDTO {
  @IsString()
  @IsNotEmpty()
  public sharingId: string;

  @IsEnum(State)
  @IsNotEmpty()
  public state: State;
}
