import { DocumentType } from '@/dtos/request/document.dto';
import { Ref, getModelForClass, prop } from '@typegoose/typegoose';
import { User } from './users.model';
import { WorkExperience } from './workExperience.model';

export class Document {
  @prop({ required: true })
  public name!: string;

  @prop({ enum: DocumentType, type: String, required: true })
  public type!: DocumentType;

  @prop({ required: true })
  public privateUrl!: string;

  @prop({ required: true, ref: User, type: String })
  public user!: Ref<User, string>;

  @prop({ ref: 'WorkExperience', type: String })
  public workExperience?: Ref<WorkExperience, string>;

  @prop({ type: Date, default: Date.now })
  public createdAt?: Date;

  @prop({ type: Date, default: Date.now })
  public updatedAt?: Date;
}

export const DocumentModel = getModelForClass(Document);
