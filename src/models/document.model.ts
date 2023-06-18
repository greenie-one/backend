import { Ref, getModelForClass, prop } from '@typegoose/typegoose';
import { User } from './users.model';

export enum DocumentType {
  WORK = 'work',
  CERIFICATE = 'cerificate',
  MARKSHEET = 'marksheet',
  TAX = 'tax',
  EDUCATION = 'education',
  OTHER = 'other',
}

export class Document {
  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public type!: DocumentType;

  @prop({ required: true })
  public url!: string;

  @prop({ required: true, ref: User })
  public user!: Ref<User>;

  @prop({ type: Date, default: Date.now })
  public createdAt?: Date;

  @prop({ type: Date, default: Date.now })
  public updatedAt?: Date;
}

export const DocumentModel = getModelForClass(Document);
