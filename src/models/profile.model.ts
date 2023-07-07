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
  public profilePic!: string;

  @prop({ type: String })
  public greenie_id?: string;

  @prop({ type: String })
  public bio?: string;

  @prop({ ref: 'User' })
  public user!: Ref<User>;

  @prop({ type: String, required: false })
  public profilePicture?: string;

  @prop({ type: Array<string>, default: [] })
  public descriptionTags!: string[];

  @prop({ type: () => Verification })
  public verification?: Verification;

  @prop({ type: Number, default: 0, index: true })
  public score: number;

  public createdAt?: Date;

  public updatedAt?: Date;
}

export const ProfileModel = getModelForClass(Profile);
