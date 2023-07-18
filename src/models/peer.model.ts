import { getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { User } from './users.model';

export enum State {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export class Status {
  @prop({ enum: State, type: String, default: State.PENDING })
  public state: State;

  @prop({
    type: String,
    required: function (this: Status) {
      return this.state === State.REJECTED;
    },
  })
  public dispute_type?: string;

  @prop({ type: String })
  @prop({
    type: String,
    required: function (this: Status) {
      return this.state === State.REJECTED;
    },
  })
  public dispute_reason?: string;
}

export enum Rating {
  NON_COLLABORATIVE = 'non-collaborative',
  RARELY_COLLABORATIVE = 'rarely-collaborative',
  OCCASIONALLY_COLLABORATIVE = 'occasionally-collaborative',
  MODERATELY_COLLABORATIVE = 'moderately-collaborative',
  HIGHLY_COLLABORATIVE = 'highly-collaborative',
}

export class WorkExFields {
  @prop()
  public candidateId?: Status;

  @prop()
  public department?: Status;

  @prop()
  public designation?: Status;

  @prop()
  public dateOfJoining?: Status;

  @prop()
  public dateOfLeaving?: Status;

  @prop()
  public peerPost?: Status;

  @prop()
  public salary?: Status;

  @prop({ enum: Rating, type: String })
  public attitudeRating?: Rating;

  @prop({ type: Boolean })
  public eligibleForRehire?: boolean;

  @prop({ type: Boolean })
  public exitProcedure?: boolean;

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
