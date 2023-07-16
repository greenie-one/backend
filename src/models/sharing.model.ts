import { Ref, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { Document } from 'mongoose';
import { State, WorkPeer } from './peer.model';
import { Skills } from './skills.model';
import { User } from './users.model';

enum SharedThing {
  SKILLS = 'Skills',
  DOCUMENT = 'Document',
}

enum SharedWith {
  PEER = 'Peer',
  USER = 'User',
}

@modelOptions({ schemaOptions: { timestamps: true } })
class Sharing {
  @prop({ enum: SharedWith, type: String, default: SharedWith.PEER })
  public sharedWith?: SharedWith;

  @prop({ refPath: 'sharedWith', required: true })
  public sharedWithRef!: Ref<WorkPeer | User>;

  @prop({ enum: SharedThing, type: String, default: SharedThing.SKILLS })
  public sharedThing?: SharedThing;

  @prop({ refPath: 'sharedThings', required: true })
  public sharedThingRef!: Ref<Skills | Document>;

  @prop({ enum: State, type: String, default: State.PENDING })
  public state?: State;

  public createdAt?: Date;

  public updatedAt?: Date;
}

export const SharingModel = getModelForClass(Sharing);
