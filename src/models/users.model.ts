import { getModelForClass, prop } from '@typegoose/typegoose';

export class User {
  public _id?: string;

  @prop({ type: String, required: false, unique: true, sparse: true })
  public email: string;

  @prop({ type: String, required: false, unique: true, sparse: true })
  public mobileNumber?: string;

  @prop({ type: String, required: false })
  public password?: string;

  @prop({ type: String })
  public roles!: string[];
}

export const UserModel = getModelForClass(User);
