import { getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { Document } from 'mongoose';
import { Peer, State } from './peer.model';
import { Skills } from './skills.model';

@modelOptions({ schemaOptions: { timestamps: true } })
class PeerVerificationSkills {
  @prop({ ref: 'Peer', required: true })
  public peer!: Ref<Peer>;

  @prop({ enum: State, type: String, default: State.PENDING })
  public state?: State;

  @prop({ ref: 'Skills', required: true })
  public skill!: Ref<Skills>;

  public createdAt?: Date;

  public updatedAt?: Date;
}

@modelOptions({ schemaOptions: { timestamps: true } })
class PeerVerificationDocuments {
  @prop({ ref: 'Peer', required: true })
  public peer!: Ref<Peer>;

  @prop({ enum: State, type: String, default: State.PENDING })
  public state?: State;

  @prop({ ref: 'Document', required: true })
  public document!: Ref<Document>;

  public createdAt?: Date;

  public updatedAt?: Date;
}

@modelOptions({ schemaOptions: { timestamps: true } })
class PeerVerification {
  @prop({ ref: 'Peer', required: true })
  public peer!: Ref<Peer>;

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

export const PeerVerificationModel = getModelForClass(PeerVerification);
export const PeerVerificationSkillsModel = getModelForClass(PeerVerificationSkills);
export const PeerVerificationDocumentsModel = getModelForClass(PeerVerificationDocuments);
