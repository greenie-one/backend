import { Ref, getModelForClass, prop } from '@typegoose/typegoose';
import { Mixed } from 'mongoose';
import { User } from './users.model';
import { Verification } from './verified.model';

export enum DocumentTypeEnum {
  AADHAR = 'AADHAR',
  PAN = 'PAN',
  DRIVING_LICENSE = 'DRIVING_LICENSE',
}

export class Document {
  @prop({ required: true, enum: DocumentTypeEnum, type: String })
  public document_type!: DocumentTypeEnum;

  @prop({ required: true })
  public document_number!: string;

  @prop({ required: true })
  public doument_data!: Mixed;

  @prop({ ref: 'User' })
  public user!: Ref<User>;

  @prop({ type: () => Verification })
  public verification?: Verification;

  @prop({ type: Date, default: Date.now })
  public createdAt?: Date;

  @prop({ type: Date, default: Date.now })
  public updatedAt?: Date;
}

export const DocumentModel = getModelForClass(Document);
