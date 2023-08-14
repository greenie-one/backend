import { IDTypeEnum } from '@/dtos/request/ids.dto';
import { AadharUserAddress, AadharVerifyResult } from '@/remote/dtos/aadhar.response';
import { DLResult, DLUserAddress } from '@/remote/dtos/driving.response';
import { PanResult, PanUserAddress } from '@/remote/dtos/pan.response';
import { Ref, getModelForClass, prop } from '@typegoose/typegoose';
import { Schema } from 'mongoose';
import { Location } from './location.model';
import { User } from './users.model';

export class ID {
  @prop({ required: true, enum: IDTypeEnum, type: String })
  public id_type!: IDTypeEnum;

  @prop({ required: true })
  public id_number!: string;

  //todo
  @prop({ required: true, type: Schema.Types.Mixed })
  public data!: AadharVerifyResult | DLResult | PanResult;

  @prop({ ref: () => User })
  public user!: Ref<User>;

  @prop({ required: true, type: Schema.Types.Mixed })
  public address!: AadharUserAddress | PanUserAddress | DLUserAddress;

  @prop({ required: true })
  public normalizedAddress!: object;

  @prop({ ref: () => Location, type: String })
  public location?: Ref<Location, string>; 

  @prop({ type: Date, default: Date.now })
  public createdAt?: Date;

  @prop({ type: Date, default: Date.now })
  public updatedAt?: Date;
}

export const IDModel = getModelForClass(ID);
