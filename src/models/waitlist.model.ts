import { getModelForClass, prop } from '@typegoose/typegoose';

export class Waitlist {
  @prop({ required: true })
  public email!: string;

  @prop({ required: true })
  public name!: string;
}

export const WaitlistModel = getModelForClass(Waitlist);
