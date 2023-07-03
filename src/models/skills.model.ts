import { getModelForClass, modelOptions, Post, prop, Ref } from '@typegoose/typegoose';
import { PeerVerificationModel } from './peerVerification.model';
import { User } from './users.model';
import { WorkExperience } from './workExperience.model';

export enum skillTypeEnum {
  AMATEUR = 'AMATEUR',
  EXPERT = 'EXPERT',
}

@Post<Skills>('deleteOne', async (doc) => {
  await PeerVerificationModel.deleteMany({ type: 'SKILL', ref: doc._id });
})
@modelOptions({ schemaOptions: { collection: 'skills', timestamps: true } })
export class Skills {
  @prop({ ref: 'User' })
  public user!: Ref<User>;

  @prop({ type: String, required: true })
  public skillName!: string;

  @prop({ required: true, enum: skillTypeEnum, type: String })
  public expertise!: skillTypeEnum;

  @prop({ ref: 'WorkExperience' })
  public workExperience?: Ref<WorkExperience>;

  public createdAt?: Date;

  public updatedAt?: Date;
}

export const SkillModel = getModelForClass(Skills);
