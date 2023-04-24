import { Ref, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { User } from './users.model';
import { Verification } from './verified.model';

@modelOptions({ schemaOptions: { collection: 'profiles', timestamps: true } })
export class Profile {
  @prop({ type: String, required: true })
  public first_name!: string;

  @prop({ type: String, required: true })
  public last_name!: string;

  @prop({ ref: 'User' })
  public user!: Ref<User>;

  @prop({ type: () => Verification })
  public verification!: Verification;

  public createdAt?: Date;

  public updatedAt?: Date;
}

export const ProfileModel = getModelForClass(Profile);
