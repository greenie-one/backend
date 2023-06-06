import { Ref, getModelForClass, prop } from '@typegoose/typegoose';
import { Mixed } from 'mongoose';
import { User } from './users.model';
import { Verification } from './verified.model';

export enum IDTypeEnum {
  AADHAR = 'AADHAR',
  PAN = 'PAN',
  DRIVING_LICENSE = 'DRIVING_LICENSE',
}

export class ID {
  @prop({ required: true, enum: IDTypeEnum, type: String })
  public id_type!: IDTypeEnum;

  @prop({ required: true })
  public id_number!: string;

  @prop({ required: true })
  public id_data!: Mixed;

  @prop({ ref: 'User' })
  public user!: Ref<User>;

  @prop({ type: () => Verification })
  public verification?: Verification;

  @prop({ type: Date, default: Date.now })
  public createdAt?: Date;

  @prop({ type: Date, default: Date.now })
  public updatedAt?: Date;
}

export const IDModel = getModelForClass(ID);
