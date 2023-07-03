import { Post, Ref, getModelForClass, prop } from '@typegoose/typegoose';
import { PeerVerificationModel } from './peerVerification.model';
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

@Post<Document>('deleteOne', async (doc) => {
  await PeerVerificationModel.deleteMany({ type: 'DOCUMENT', ref: doc._id });
})
export class Document {
  @prop({ required: true })
  public name!: string;

  @prop({ enum: DocumentType, type: String, required: true })
  public type!: DocumentType;

  @prop({ required: true })
  public url!: string;

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
