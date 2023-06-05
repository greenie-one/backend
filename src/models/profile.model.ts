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
  public greenie_id?: string;

  @prop({ type: String })
  public Bio?: string;

  @prop({ ref: 'User' })
  public user!: Ref<User>;

  @prop({ type: Array<string>, default: [] })
  public descriptionTags!: string[];

  @prop({ type: () => Verification })
  public verification?: Verification;

  public createdAt?: Date;

  public updatedAt?: Date;
}

export const ProfileModel = getModelForClass(Profile);
