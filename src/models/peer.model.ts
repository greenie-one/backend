import { getModelForClass, index, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { User } from './users.model';

export enum State {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

@modelOptions({ schemaOptions: { _id: false } })
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

  static defaultStatus() {
    const defaultStatus = new Status();
    defaultStatus.state = State.PENDING;
    return defaultStatus;
  }
}

export enum Rating {
  NON_COLLABORATIVE = 'non-collaborative',
  RARELY_COLLABORATIVE = 'rarely-collaborative',
  OCCASIONALLY_COLLABORATIVE = 'occasionally-collaborative',
  MODERATELY_COLLABORATIVE = 'moderately-collaborative',
  HIGHLY_COLLABORATIVE = 'highly-collaborative',
  NOT_GIVEN = 'not-given',
}

@modelOptions({ schemaOptions: { _id: false } })
export class OptionalWorkExFields {
  @prop()
  public candidateId?: Status;

  @prop()
  public department?: Status;

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

  static defaultFields() {
    const defaultOptionalWorkExFields = new OptionalWorkExFields();
    defaultOptionalWorkExFields.candidateId = Status.defaultStatus();
    defaultOptionalWorkExFields.department = Status.defaultStatus();
    defaultOptionalWorkExFields.dateOfJoining = Status.defaultStatus();
    defaultOptionalWorkExFields.dateOfLeaving = Status.defaultStatus();
    defaultOptionalWorkExFields.companyName = Status.defaultStatus();
    defaultOptionalWorkExFields.workType = Status.defaultStatus();
    defaultOptionalWorkExFields.workMode = Status.defaultStatus();
    defaultOptionalWorkExFields.salary = Status.defaultStatus();
    return defaultOptionalWorkExFields;
  }
}

@modelOptions({ schemaOptions: { _id: false } })
export class MandatoryWorkExFields {
  @prop({ type: String, default: 'No Review' })
  public review?: string;

  static defaultFields() {
    const defaultMandatoryWorkExFields = new MandatoryWorkExFields();
    defaultMandatoryWorkExFields.review = 'No Review';
    return defaultMandatoryWorkExFields;
  }
}

@modelOptions({ schemaOptions: { _id: false } })
export class MandatoryQuestionFields {
  @prop({ enum: Rating, type: String, default: Rating.NOT_GIVEN })
  public attitudeRating?: Rating;

  @prop({ default: Status.defaultStatus() })
  public eligibleForRehire?: Status;

  static defaultFields() {
    const defaultMandatoryQuestionFields = new MandatoryQuestionFields();
    defaultMandatoryQuestionFields.attitudeRating = Rating.NOT_GIVEN;
    defaultMandatoryQuestionFields.eligibleForRehire = Status.defaultStatus();
    return defaultMandatoryQuestionFields;
  }
}

@modelOptions({ schemaOptions: { _id: false } })
export class HRQuestionFields {
  @prop({ default: Status.defaultStatus() })
  public exitProcedure?: Status;

  static defaultFields() {
    const defaultHRQuestionFields = new HRQuestionFields();
    defaultHRQuestionFields.exitProcedure = Status.defaultStatus();
    return defaultHRQuestionFields;
  }
}

@modelOptions({ schemaOptions: { _id: false } })
export class ExceptHRQuestionFields {
  @prop({ default: Status.defaultStatus() })
  public designation!: Status;

  @prop({ default: Status.defaultStatus() })
  public peerPost!: Status;

  static defaultFields() {
    const defaultExceptHRQuestionFields = new ExceptHRQuestionFields();
    defaultExceptHRQuestionFields.designation = Status.defaultStatus();
    defaultExceptHRQuestionFields.peerPost = Status.defaultStatus();
    return defaultExceptHRQuestionFields;
  }
}

export enum WorkVerificationBy {
  COLLEAGUE = 'COLLEAGUE',
  REPORTING_MANAGER = 'REPORTING_MANAGER',
  LINE_MANAGER = 'LINE_MANAGER',
  HR = 'HR',
  CXO = 'CXO',
}

// Index for unique peer, scoped to user, email and workExperience ref
@modelOptions({ schemaOptions: { timestamps: true } })
@index({ user: 1, email: 1, ref: 1 }, { unique: true })
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

  @prop()
  public optionalVerificationFields?: OptionalWorkExFields;

  @prop({ default: MandatoryWorkExFields.defaultFields() })
  public mandatoryVerificationFields?: MandatoryWorkExFields;

  @prop({ default: MandatoryQuestionFields.defaultFields() })
  public mandatoryQuestionFields?: MandatoryQuestionFields;

  @prop()
  public otherQuestionFields!: HRQuestionFields | ExceptHRQuestionFields;

  public createdAt?: Date;

  public updatedAt?: Date;

  @prop({ type: Boolean, default: false })
  public completedVerification?: boolean;
}

export const WorkPeerModel = getModelForClass(WorkPeer);
