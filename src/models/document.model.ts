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
  public private_url!: string;

  @prop({ required: true, ref: User })
  public user!: Ref<User>;

  @prop({
    ref: 'WorkExperience',
    required: function (this: Document) {
      return this.type === DocumentType.WORK;
    },
  })
  public workExperience?: Ref<WorkExperience>;

  @prop({ type: Date, default: Date.now })
  public createdAt?: Date;

  @prop({ type: Date, default: Date.now })
  public updatedAt?: Date;
}

export const DocumentModel = getModelForClass(Document);
