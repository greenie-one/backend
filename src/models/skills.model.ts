import { SkillTypeEnum } from '@/dtos/request/skills.dto';
import { Ref, getModelForClass, prop } from '@typegoose/typegoose';
import { User } from './users.model';
import { WorkExperience } from './workExperience.model';

export class Skills {
  @prop({ ref: () => User })
  public user!: Ref<User>;

  @prop({ type: String, required: true })
  public skillName!: string;

  @prop({ required: true, enum: SkillTypeEnum, type: String })
  public expertise!: SkillTypeEnum;

  @prop({ ref: () => WorkExperience, type: String })
  public workExperience?: Ref<WorkExperience, string>;

  public createdAt?: Date;

  public updatedAt?: Date;
}

export const SkillModel = getModelForClass(Skills);
