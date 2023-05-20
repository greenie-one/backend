import { getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { User } from './users.model';

@modelOptions({ schemaOptions: { collection: 'work_experiences', timestamps: true } })
export class WorkExperience {
  @prop({ type: String, required: true })
  public image!: string;

  @prop({ type: String, required: true })
  public designation!: string;

  @prop({ type: String, required: true })
  public companyName!: string;

  @prop({ type: Boolean, default: false })
  public isVerified?: boolean;

  @prop({ type: String })
  public companyDuration?: string;

  @prop({ type: String })
  public description?: string;

  @prop({ ref: 'User' })
  public verifiedBy?: Ref<User>;

  public createdAt?: Date;

  public updatedAt?: Date;
}

export const WorkExperienceModel = getModelForClass(WorkExperience);
