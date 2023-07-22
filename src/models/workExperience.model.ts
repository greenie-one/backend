import { CompanyTypeEnum } from '@/dtos/request/workExperience.dto';
import { getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { User } from './users.model';


@modelOptions({ schemaOptions: { collection: 'work_experiences', timestamps: true } })
export class WorkExperience {
  @prop({ enum: CompanyTypeEnum, type: String, required: true })
  public companyType!: CompanyTypeEnum;

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

