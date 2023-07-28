import { Ref, getModelForClass, index, modelOptions, prop } from '@typegoose/typegoose';
import { ResidentialInfo } from './residentialInfo.model';
import { User } from './users.model';

@modelOptions({ schemaOptions: { timestamps: true } })
@index({ user: 1, email: 1, ref: 1 }, { unique: true })
export class ResidentialPeer {
  @prop({ required: true, ref: 'User', type: String })
  public user!: Ref<User, string>;

  @prop({ required: true, ref: 'ResidentialInfo', type: String })
  public ref!: Ref<ResidentialInfo, string>;

  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public email!: string;

  @prop({ required: true })
  public phone!: string;

  @prop({ type: Boolean, default: false })
  public emailVerified?: boolean;

  @prop({ type: Boolean, default: false })
  public phoneVerified?: boolean;

  @prop({ required: true, type: String })
  public verificationBy!: string;

  public createdAt?: Date;

  public updatedAt?: Date;

  @prop({ type: Boolean, default: false })
  public isVerificationCompleted?: boolean;
}

export const ResidentialPeerModel = getModelForClass(ResidentialPeer);
