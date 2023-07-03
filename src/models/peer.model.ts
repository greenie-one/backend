import { getModelForClass, modelOptions, Post, prop, Ref } from '@typegoose/typegoose';
import { PeerVerificationDocumentsModel, PeerVerificationModel, PeerVerificationSkillsModel } from './peerVerification.model';
import { WorkExperience } from './workExperience.model';

export enum State {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

enum PeerType {
  COLLEAGUE = 'COLLEAGUE',
  REPORTING_MANAGER = 'REPORTING_MANAGER',
  LINE_MANAGER = 'LINE_MANAGER',
  HR = 'HR',
  CXO = 'CXO',
}

@Post<Peer>('deleteOne', async (doc) => {
  await PeerVerificationModel.deleteMany({ peer: doc._id });
  await PeerVerificationSkillsModel.deleteMany({ peer: doc._id });
  await PeerVerificationDocumentsModel.deleteMany({ peer: doc._id });
})
@modelOptions({ schemaOptions: { timestamps: true } })
export class Peer {
  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public email!: string;

  @prop({ required: true })
  public phone!: string;

  @prop({ required: true, enum: PeerType, type: String })
  public peerType!: PeerType;

  @prop({ ref: 'WorkExperience', required: true })
  public workExperience!: Ref<WorkExperience>;

  public createdAt?: Date;

  public updatedAt?: Date;
}

export const PeerModel = getModelForClass(Peer);
