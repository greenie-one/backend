import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { v4 } from 'uuid';

@modelOptions({ schemaOptions: { collection: 'auth-session', timestamps: true } })
class AuthSession {
  @prop({ required: true, default: v4 })
  public _id?: string;

  @prop({ type: String, required: true, unique: false })
  public token: string;
}

export const AuthSessionModel = getModelForClass(AuthSession);
