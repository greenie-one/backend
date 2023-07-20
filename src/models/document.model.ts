import { Ref, getModelForClass, prop } from '@typegoose/typegoose';
import { User } from './users.model';
import { WorkExperience } from './workExperience.model';

export enum DocumentType {
  WORK = 'work',
  CERTIFICATE = 'certificate',
  MARKSHEET = 'marksheet',
  TAX = 'tax',
  EDUCATION = 'education',
  OTHER = 'other',
}

export class Document {
  @prop({ required: true })
  public name!: string;

  @prop({ enum: DocumentType, type: String, required: true })
  public type!: DocumentType;

  @prop({ required: true })
  public privateUrl!: string;

  @prop({ required: true, ref: User, type: String })
  public user!: Ref<User, string>;

  @prop({
    ref: 'WorkExperience',
    type: String,
    required: function (this: Document) {
      return this.type === DocumentType.WORK;
    },
  })
  public workExperience?: Ref<WorkExperience, string>;

  @prop({ type: Date, default: Date.now })
  public createdAt?: Date;

  @prop({ type: Date, default: Date.now })
  public updatedAt?: Date;
}

export const DocumentModel = getModelForClass(Document);
