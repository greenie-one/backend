import { getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { User } from './users.model';

@modelOptions({ schemaOptions: { collection: 'skills', timestamps: true } })
export class Skills {
  @prop({ type: String })
  public image: string;

  @prop({ type: String, required: true })
  public designation!: string;

  @prop({ type: Boolean, default: false })
  public isVerified?: boolean;

  @prop({ ref: 'User' })
  public user!: Ref<User>;

  @prop({ type: Number, required: true })
  public skillRate?: number;

  public createdAt?: Date;

  public updatedAt?: Date;
}

export const SkillModel = getModelForClass(Skills);
