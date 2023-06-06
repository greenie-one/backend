import { Ref, getModelForClass, prop } from '@typegoose/typegoose';
import { ID } from './id.model';
import { User } from './users.model';

export class DocumentSharing {
  @prop({ ref: 'User', required: true })
  public user!: Ref<User>;

  @prop({ ref: 'Document', required: true })
  public document!: Ref<ID>;

  @prop({ type: [{ ref: 'User' }], required: false, default: [] })
  public sharedWith?: Ref<User>[];
}

export const DocumentSharingModel = getModelForClass(DocumentSharing);
