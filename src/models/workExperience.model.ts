import { getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { User } from './users.model';

export enum companyTypeEnum {
  Startup = 'Startup',
  Registered = 'Registered',
  Unregistered = 'Unregistered',
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
  public linkedInUrl?: string;

  @prop({ type: String })
  public workType?: string;

  @prop({ type: String })
  public workMode?: string;

  @prop({ type: Date, required: true })
  public companyStartDate!: Date;

  @prop({ type: Date })
  public companyEndDate?: Date;

  @prop({ type: String })
  public reason_for_leaving?: string;

  @prop({ ref: 'User' })
  public user!: Ref<User>;

  public createdAt?: Date;

  public updatedAt?: Date;
}

export const WorkExperienceModel = getModelForClass(WorkExperience);
