import { Ref, getModelForClass, prop } from '@typegoose/typegoose';
import { Location } from './location.model';
import { User } from './users.model';
import { Verification } from './verified.model';

export class ResidentialInfo {
  @prop({ required: true })
  public address_line_1!: string;

  @prop({ required: true })
  public address_line_2!: string;

  @prop({ required: true })
  public landmark!: string;

  @prop({ required: true })
  public pincode!: string;

  @prop({ required: true })
  public city!: string;

  @prop({ required: true })
  public state!: string;

  @prop({ required: true })
  public country!: string;

  @prop({ type: Date })
  public start_date?: Date;

  @prop({ type: Date })
  public end_date?: Date;

  @prop({ type: () => Verification })
  public verification?: Verification;

  @prop({ ref: 'User' })
  public user!: Ref<User>;

  @prop({ ref: 'Location' })
  public location!: Ref<Location>;

  @prop({ ref: 'Location' })
  public capturedLocation!: Ref<Location>;
}

export const ResidentialInfoModel = getModelForClass(ResidentialInfo);
