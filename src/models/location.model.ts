import { Ref, getModelForClass, prop } from '@typegoose/typegoose';
import { Schema } from 'mongoose';
import { User } from './users.model';

export enum AddressType {
  AADHAR = 'AADHAR',
  PAN = 'PAN',
  DRIVING_LICENSE = 'DRIVING_LICENSE',
  GPS = 'GPS',
  IP = 'IP',
}

export class Location {
  @prop({ required: true, type: Schema.Types.Mixed })
  public address!: object;

  @prop({ required: true })
  public coordinates!: string;

  @prop({ required: true, enum: AddressType, type: String })
  public type!: AddressType;

  @prop({ required: true, ref: User })
  public user!: Ref<User>;

  @prop({ type: Date, default: Date.now })
  public createdAt?: Date;

  @prop({ type: Date, default: Date.now })
  public updatedAt?: Date;
}

export const LocationModel = getModelForClass(Location);
