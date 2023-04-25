import { Ref, getModelForClass, prop } from '@typegoose/typegoose';
import { User } from './users.model';

class Address {
  @prop({ required: true })
  public country!: string;

  @prop({ required: true })
  public district!: string;

  @prop({ required: true })
  public state!: string;

  @prop({ required: true })
  public po!: string;

  @prop({ required: true })
  public vtc!: string;

  @prop({ required: true })
  public subdist!: string;

  @prop({ required: true })
  public house!: string;

  @prop()
  public loc?: string;

  @prop()
  public street?: string;

  @prop()
  public landmark?: string;

  @prop({ required: true })
  public zip!: string;
}

export class AadharCard {
  @prop({ required: true, minlength: 12, maxlength: 12 })
  public aadhar_number!: string;

  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public gender!: 'M' | 'F' | 'O';

  @prop({ required: true })
  public dob!: Date;

  @prop({ required: true, minlength: 10, maxlength: 10 })
  public phone!: string;

  @prop({ required: true, _id: false, type: () => Address })
  public address!: Address;

  @prop({ required: true })
  public photo!: string;

  @prop({ ref: 'User' })
  public user!: Ref<User>;

  @prop({ required: true })
  public signature!: string;

  public createdAt?: Date;

  public updatedAt?: Date;
}

export const AadharCardModel = getModelForClass(AadharCard);
