import { User } from './users.model';
import { Ref, getModelForClass, prop } from '@typegoose/typegoose';
import { Verification } from './verified.model';

export class EducationHistory {
  @prop({ required: true })
  public institution!: string;

  @prop({ required: true })
  public degree!: string;

  @prop({ required: true })
  public fieldOfStudy!: string;

  @prop()
  public startDate?: Date;

  @prop()
  public endDate?: Date;

  @prop({ type: () => Verification })
  public verification!: Verification;

  @prop({ ref: 'User' })
  public user!: Ref<User>;
}

export const EducationHistoryModel = getModelForClass(EducationHistory);
