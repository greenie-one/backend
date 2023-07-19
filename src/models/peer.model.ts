import { getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { User } from './users.model';

export enum State {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export class Status {
  @prop({ enum: State, type: String })
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
  NOT_GIVEN = 'not-given',
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
  public companyName?: Status;

  @prop()
  public workType?: Status;

  @prop()
  public workMode?: Status;

  @prop()
  public salary?: Status;

  @prop({ enum: Rating, type: String })
  public attitudeRating?: Rating;

  @prop({})
  public eligibleForRehire?: Status;

  @prop({})
  public exitProcedure?: Status;

  @prop({ type: String })
  public review?: string;
}

export function defaultWorkExFields() {
  const defaultStatus = new Status();
  defaultStatus.state = State.PENDING;

  const defaultRating = Rating.NOT_GIVEN;
  const defaultValues: Partial<WorkExFields> = {
    candidateId: defaultStatus,
    department: defaultStatus,
    designation: defaultStatus,
    dateOfJoining: defaultStatus,
    dateOfLeaving: defaultStatus,
    salary: defaultStatus,
    eligibleForRehire: defaultStatus,
    exitProcedure: defaultStatus,
    companyName: defaultStatus,
    workMode: defaultStatus,
    workType: defaultStatus,
    attitudeRating: defaultRating,
    review: '',
  };
  return defaultValues;
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
