import { Rating, State, WorkVerificationBy } from '@/dtos/request/peer.dto';
import { Ref, getModelForClass, index, modelOptions, prop } from '@typegoose/typegoose';
import { Document } from 'mongoose';
import { Skills } from './skills.model';
import { User } from './users.model';

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

@modelOptions({ schemaOptions: { _id: false } })
export class SelectedFields {
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
    const defaultOptionalWorkExFields = new SelectedFields();
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
export class AllQuestions {
  @prop({ type: String, enum: Rating })
  public attitudeRating!: Rating;

  @prop()
  public designation!: Status;

  @prop()
  public peerPost!: Status;

  @prop({ type: String })
  public review!: string;

  static defaultFields() {
    const defaultFields = new AllQuestions();
    defaultFields.peerPost = Status.defaultStatus();
    defaultFields.attitudeRating = Rating.NOT_GIVEN;
    defaultFields.designation = Status.defaultStatus();
    defaultFields.review = 'No Review';
    return defaultFields;
  }
}

@modelOptions({ schemaOptions: { _id: false } })
export class HRQuestions {
  @prop()
  public exitProcedure!: Status;

  @prop()
  public eligibleForRehire!: Status;

  static defaultFields() {
    const defaultHRQuestionFields = new HRQuestions();
    defaultHRQuestionFields.exitProcedure = Status.defaultStatus();
    defaultHRQuestionFields.eligibleForRehire = Status.defaultStatus();
    return defaultHRQuestionFields;
  }
}

@modelOptions({ schemaOptions: { _id: false } })
export class SkillsVerification {
  @prop({ type: String, ref: 'Skills', required: true })
  public id!: Ref<Skills, string>;

  @prop({ default: Status.defaultStatus() })
  public status?: Status;

  constructor(skill: Ref<Skills, string>) {
    this.id = skill;
    this.status = Status.defaultStatus();
  }
}

@modelOptions({ schemaOptions: { _id: false } })
export class DocumentVerification {
  @prop({ type: String, ref: 'Document', required: true })
  public id!: Ref<Document, string>;

  @prop({ default: Status.defaultStatus() })
  public status?: Status;

  constructor(document: Ref<Document, string>) {
    this.id = document;
    this.status = Status.defaultStatus();
  }
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
  public selectedFields?: SelectedFields;

  @prop({ default: AllQuestions.defaultFields() })
  public allQuestions?: AllQuestions;

  @prop()
  public otherQuestions!: HRQuestions;

  @prop({ required: true })
  public skills!: SkillsVerification[];

  @prop({ required: true })
  public documents!: DocumentVerification[];

  public createdAt?: Date;

  public updatedAt?: Date;

  @prop({ type: Boolean, default: false })
  public isVerificationCompleted?: boolean;
}

export const WorkPeerModel = getModelForClass(WorkPeer);
