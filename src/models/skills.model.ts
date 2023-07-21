import { SkillTypeEnum } from '@/dtos/request/skills.dto';
import { getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { User } from './users.model';
import { WorkExperience } from './workExperience.model';



@modelOptions({ schemaOptions: { collection: 'skills', timestamps: true } })
export class Skills {
  @prop({ ref: 'User' })
  public user!: Ref<User>;

  @prop({ type: String, required: true })
  public skillName!: string;

  @prop({ required: true, enum: SkillTypeEnum, type: String })
  public expertise!: SkillTypeEnum;

  @prop({ ref: 'WorkExperience', type: String })
  public workExperience?: Ref<WorkExperience, string>;

  public createdAt?: Date;

  public updatedAt?: Date;
}

export const SkillModel = getModelForClass(Skills);
