import { getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { Document } from './document.model';
import { Peer, State } from './peer.model';
import { Skills } from './skills.model';

enum PeerVerificationType {
  DOCUMENT = 'DOCUMENT',
  SKILL = 'SKILL',
}

@modelOptions({ schemaOptions: { timestamps: true } })
export class PeerVerification {
  @prop({ ref: 'Peer', required: true })
  public peer!: Ref<Peer>;

  @prop({ enum: PeerVerificationType, type: String, required: true })
  public type!: PeerVerificationType;

  @prop({ enum: State, type: String, default: State.PENDING })
  public state?: State;

  @prop({ refPath: 'type', required: true })
  public ref!: Ref<Document | Skills>;

  public createdAt?: Date;

  public updatedAt?: Date;
}

export const PeerVerificationModel = getModelForClass(PeerVerification);
