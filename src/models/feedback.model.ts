import { Ref, getModelForClass, prop } from '@typegoose/typegoose';
import { User } from './users.model';
import { FeedbackType } from '@/dtos/request/feedback.dto';

export class Feedback {
  @prop({required: true, enum: FeedbackType, type: String })
  public type: string;

  @prop({ required: true, type: String })
  public flowExperience!: string;

  @prop({ required: true, type: String })
  public referToSomeone!: string;

  @prop({ type: String })
  public message?: string;

  @prop({ required: true, ref: User })
  public user!: Ref<User>;

  @prop({ type: Date, default: Date.now })
  public createdAt?: Date;

  @prop({ type: Date, default: Date.now })
  public updatedAt?: Date;
}

export const FeedbackModel = getModelForClass(Feedback);