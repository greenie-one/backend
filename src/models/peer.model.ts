import { getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { Location } from './location.model';
import { WorkExperience } from './workExperience.model';

export enum State {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export enum PeerFor {
  LOCATION = 'Location',
  WORKEXPERIENCE = 'WorkExperience',
}

export class WorkExFields {
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
}

class LocationFields {
  @prop({ enum: State, type: String, default: State.PENDING })
  public success?: State;
}

export enum WorkVerificationBy {
  COLLEAGUE = 'COLLEAGUE',
  REPORTING_MANAGER = 'REPORTING_MANAGER',
  LINE_MANAGER = 'LINE_MANAGER',
  HR = 'HR',
  CXO = 'CXO',
}

@modelOptions({ schemaOptions: { timestamps: true } })
export class Peer {
  @prop({ required: true, enum: PeerFor, type: String })
  public peerFor!: PeerFor;

  @prop({ required: true, refPath: 'peerFor' })
  public peerForRef!: Ref<WorkExperience | Location>;

  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public email!: string;

  @prop({ required: true })
  public phone!: string;

  @prop({ required: true })
  public verification_by!: string;

  @prop({ required: true })
  public verification_fields!: WorkExFields | LocationFields;

  public createdAt?: Date;

  public updatedAt?: Date;
}

export const PeerModel = getModelForClass(Peer);
