import { Ref, getModelForClass, prop } from '@typegoose/typegoose';
import { User } from './users.model';

export class Location {
  @prop({ required: true, type: Number })
  public longitude!: number;

  @prop({ required: true, type: Number })
  public latitude!: number;

  @prop({ required: true, ref: () => User })
  public user!: Ref<User>;

  @prop({ type: Date, default: Date.now })
  public createdAt?: Date;

  @prop({ type: Date, default: Date.now })
  public updatedAt?: Date;
}

export const LocationModel = getModelForClass(Location);
