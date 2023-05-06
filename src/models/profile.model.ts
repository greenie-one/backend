import { Ref, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { User } from './users.model';
import { Verification } from './verified.model';

@modelOptions({ schemaOptions: { collection: 'profiles', timestamps: true } })
export class Profile {
  @prop({ type: String, required: true })
  public firstName!: string;

  @prop({ type: String, required: true })
  public lastName!: string;

  @prop({ type: String })
  public phone!: string;

  @prop({ type: String })
  public greenie_id?: string;

  @prop({ ref: 'User' })
  public user!: Ref<User>;

  @prop({ type: () => Verification })
  public verification?: Verification;

  public createdAt?: Date;

  public updatedAt?: Date;
}

export const ProfileModel = getModelForClass(Profile);
