import { getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { User } from './users.model';

export enum companyTypeEnum {
  Startup = 'Start-up (Funded)',
  EarlyStageStartup = 'Early Stage Startup',
  ProfitableStartup = 'Startup (Profitable)',
  FamilyOwnedBusiness = 'Family Owned Business',
  PrivateLimitedIndia = 'Private Limited (India)',
  PartnershipLLP = 'Partnership (LLP/LLC)',
  PublicLimitedCompany = 'Public Limited Company',
}

@modelOptions({ schemaOptions: { collection: 'work_experiences', timestamps: true } })
export class WorkExperience {
  @prop({ enum: companyTypeEnum, type: String, required: true })
  public companyType!: companyTypeEnum;

  @prop({ type: String, required: true })
  public designation!: string;

  @prop({ type: String, required: true })
  public department!: string;

  @prop({ type: String, required: true })
  public email!: string;

  @prop({ type: String, required: true })
  public companyName!: string;

  @prop({ type: String, required: true })
  public companyId!: string;

  @prop({ type: String })
  public candidateId!: string;

  @prop({ type: String })
  public linkedInUrl?: string;

  @prop({ type: String })
  public workType?: string;

  @prop({ type: String })
  public workMode?: string;

  @prop({ type: Date, required: true })
  public dateOfJoining!: Date;

  @prop({ type: Date })
  public dateOfLeaving?: Date;

  @prop({ type: String })
  public reason_for_leaving?: string;

  @prop({ type: String })
  public salary?: string;

  @prop({ ref: 'User' })
  public user!: Ref<User>;

  public createdAt?: Date;

  public updatedAt?: Date;

  @prop({ type: Number, default: 0 })
  public noOfVerifications?: number;
}

export const WorkExperienceModel = getModelForClass(WorkExperience);
