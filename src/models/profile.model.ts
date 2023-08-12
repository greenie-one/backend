import { Ref, getModelForClass, prop } from '@typegoose/typegoose';
import { User } from './users.model';

export class Profile {
  @prop({ type: String, required: true })
  public firstName!: string;

  @prop({ type: String, required: true })
  public lastName!: string;

  @prop({ type: String })
  public profilePic?: string;

  @prop({ type: String, unique: true, sparse: true })
  public greenie_id?: string;

  @prop({ type: String })
  public bio?: string;

  @prop({ ref: () => User })
  public user!: Ref<User>;

  @prop({ type: Array<string>, default: [] })
  public descriptionTags!: string[];

  @prop({ type: Number, default: 0, index: true })
  public score: number;

  public createdAt?: Date;

  public updatedAt?: Date;
}

export const ProfileModel = getModelForClass(Profile);
ProfileModel.ensureIndexes();
