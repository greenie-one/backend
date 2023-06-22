import { getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { User } from './users.model';
import { WorkExperience } from './workExperience.model';

@modelOptions({ schemaOptions: { collection: 'skills', timestamps: true } })
export class Skills {
  @prop({ ref: 'User' })
  public user!: Ref<User>;

  @prop({ type: String, required: true })
  public skillName!: string;

  @prop({ ref: 'WorkExperience' })
  public workExperience!: Ref<WorkExperience>;

  public createdAt?: Date;

  public updatedAt?: Date;
}

export const SkillModel = getModelForClass(Skills);
