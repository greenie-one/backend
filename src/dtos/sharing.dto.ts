import { Status } from '@/models/peer.model';
import { SharedThing, SharedWith } from '@/models/sharing.model';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { GetDocumentResponseDto } from './document.dto';
import { StatusField } from './peer.dto';
import { skillResponseDto } from './skills.dto';

export class sharingDTO {
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

class updateSharingPeerStates {
  @IsString()
  @IsNotEmpty()
  public sharingId: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => StatusField)
  public status: StatusField;
}

export class updateSharingPeerStatesList {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => updateSharingPeerStates)
  public data: updateSharingPeerStates[];
}

export interface getSharedResponseDTO {
  id: string;

  status: Status;

  data: skillResponseDto | GetDocumentResponseDto;
}
