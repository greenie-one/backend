import { Ref, getModelForClass, prop } from '@typegoose/typegoose';
import { Schema } from 'mongoose';
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

  @prop({ type: Schema.Types.Mixed })
  public id_data?: object;

  @prop({ ref: 'User' })
  public user!: Ref<User>;

  @prop({ reqstringuired: true })
  public address?: object;

  @prop({ type: () => Verification })
  public verification?: Verification;

  @prop({ type: Date, default: Date.now })
  public createdAt?: Date;

  @prop({ type: Date, default: Date.now })
  public updatedAt?: Date;
}

export const IDModel = getModelForClass(ID);
