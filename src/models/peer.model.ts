import { getModelForClass, modelOptions, Post, prop, Ref } from '@typegoose/typegoose';
import { WorkExperience } from './workExperience.model';

export enum State {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

@Post<Peer>('deleteOne', async (doc) => {
  await PeerModel.deleteMany({ workExperience: doc._id });
})
@modelOptions({ schemaOptions: { timestamps: true } })
export class Peer {
  @prop({ ref: 'WorkExperience', required: true })
  public workExperience!: Ref<WorkExperience>;

  @prop({ enum: State, type: String, default: State.PENDING })
  public candidateId?: State;

  @prop({ enum: State, type: String, default: State.PENDING })
  public department?: State;

  @prop({ enum: State, type: String, default: State.PENDING })
  public designation?: State;

  @prop({ enum: State, type: String, default: State.PENDING })
  public dateOfJoining?: State;

  @prop({ enum: State, type: String, default: State.PENDING })
  public dateOfLeaving?: State;

  public createdAt?: Date;

  public updatedAt?: Date;
}

export const PeerModel = getModelForClass(Peer);
