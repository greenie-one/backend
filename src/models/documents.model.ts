import { getModelForClass, prop } from '@typegoose/typegoose';
import { Verification } from './verified.model';

export class Document {
  @prop({ required: true })
  public document_type!: string;

  @prop({ required: true })
  public document_number!: string;

  @prop({ type: () => Verification })
  public verification?: Verification;
}

export const DocumentModel = getModelForClass(Document);
