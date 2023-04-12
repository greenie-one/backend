import { getModelForClass, prop } from '@typegoose/typegoose';

export class Verification {
  @prop({ type: Boolean, default: false })
  is_verified!: boolean;

  @prop({ type: Date, default: Date.now })
  last_updated?: Date;
}

export const VerificationModel = getModelForClass(Verification);
