import { IDTypeEnum } from '@/dtos/request/ids.dto';
import { NormalizedAddress } from '@/dtos/response/ids.response';
import { Ref, getModelForClass, prop } from '@typegoose/typegoose';
import { Schema } from 'mongoose';
import { Location } from './location.model';
import { User } from './users.model';
import { Verification } from './verified.model';

export class ID {
  @prop({ required: true, enum: IDTypeEnum, type: String })
  public id_type!: IDTypeEnum;

  @prop({ required: true })
  public id_number!: string;

  //todo
  @prop({ required: true, type: Schema.Types.Mixed })
  public data!: object;

  @prop({ ref: () => User })
  public user!: Ref<User>;

  @prop({ required: true, type: Schema.Types.Mixed })
  public address!: object;

  @prop({ required: true, type: () => NormalizedAddress })
  public normalizedAddress!: NormalizedAddress;

  @prop({ ref: () => Location, type: String })
  public location?: Ref<Location, string>; 

  @prop({ type: () => Verification })
  public verification?: Verification;

  @prop({ type: Date, default: Date.now })
  public createdAt?: Date;

  @prop({ type: Date, default: Date.now })
  public updatedAt?: Date;
}

export const IDModel = getModelForClass(ID);
