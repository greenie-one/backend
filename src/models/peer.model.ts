import { getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { User } from './users.model';

export enum State {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export enum Bool {
  YES = 'yes',
  NO = 'no',
}

export enum Rating {
  NON_COLLABORATIVE = 'non-collaborative',
  RARELY_COLLABORATIVE = 'rarely-collaborative',
  OCCASIONALLY_COLLABORATIVE = 'occasionally-collaborative',
  MODERATELY_COLLABORATIVE = 'moderately-collaborative',
  HIGHLY_COLLABORATIVE = 'highly-collaborative',
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

  @prop({ enum: State, type: String, default: State.PENDING })
  public peerPost?: State;

  @prop({ enum: State, type: String, default: State.PENDING })
  public salary?: State;

  @prop({ enum: Rating, type: String })
  public attitudeRating?: Rating;

  @prop({ enum: Bool, type: String })
  public eligibleForRehire?: Bool;

  @prop({ enum: Bool, type: String })
  public exitProcedure?: Bool;

  @prop({ type: String })
  public review?: string;
}

export enum WorkVerificationBy {
  COLLEAGUE = 'COLLEAGUE',
  REPORTING_MANAGER = 'REPORTING_MANAGER',
  LINE_MANAGER = 'LINE_MANAGER',
  HR = 'HR',
  CXO = 'CXO',
}

@modelOptions({ schemaOptions: { timestamps: true } })
export class WorkPeer {
  @prop({ required: true, ref: 'User', type: String })
  public user!: Ref<User, string>;

  @prop({ required: true, ref: 'WorkExperience', type: String })
  public ref!: Ref<User, string>;

  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public email!: string;

  @prop({ required: true })
  public phone!: string;

  @prop({ type: Boolean, default: false })
  public emailVerified?: boolean;

  @prop({ type: Boolean, default: false })
  public phoneVerified?: boolean;

  @prop({ required: true, enum: WorkVerificationBy, type: String })
  public verificationBy!: WorkVerificationBy;

  @prop({ required: true })
  public verificationFields!: WorkExFields;

  public createdAt?: Date;

  public updatedAt?: Date;
}

export const WorkPeerModel = getModelForClass(WorkPeer);
