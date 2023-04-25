import { Ref, getModelForClass, prop } from '@typegoose/typegoose';
import { Mixed } from 'mongoose';
import { User } from './users.model';

export class AadharCard {
  @prop({ required: true, minlength: 12, maxlength: 12 })
  public aadhar_number!: string;

  @prop({ required: true })
  public aadhar_data!: Mixed;

  @prop({ ref: 'User' })
  public user!: Ref<User>;

  public createdAt?: Date;

  public updatedAt?: Date;
}

export const AadharCardModel = getModelForClass(AadharCard);
