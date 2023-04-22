import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';

export enum UserRoles {
  DEFAULT = 'default',
  INTERNAL = 'internal',
}

@modelOptions({ schemaOptions: { collection: 'users', timestamps: true } })
export class User {
  @prop({ type: String, required: true, unique: true })
  public email: string;

  @prop({ type: String, required: false })
  public password?: string;

  @prop({ type: String, enum: UserRoles, required: true, default: [UserRoles.DEFAULT] })
  public roles!: UserRoles[];
}
export const UserModel = getModelForClass(User);
