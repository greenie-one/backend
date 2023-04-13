import { Ref, getModelForClass, prop } from '@typegoose/typegoose';
import { User } from './users.model';
import { Verification } from './verified.model';

export class Aadhaar {
  @prop()
  _id!: string;

  @prop({ required: true })
  aadhaarNumber!: string;
}

export class PAN {
  @prop()
  _id!: string;

  @prop({ required: true })
  panNumber!: string;
}

export class DrivingLicense {
  @prop()
  _id!: string;

  @prop({ required: true })
  licenseNumber!: string;
}

// Wrapper for all the documents
export enum DocumentTypeEnum {
  Aadhaar = 'Aadhaar',
  PAN = 'PAN',
  DrivingLicense = 'DrivingLicense',
}

export class Document {
  @prop({ required: true, enum: DocumentTypeEnum })
  type!: DocumentTypeEnum;

  @prop({ refPath: 'type', required: true })
  document!: Ref<Aadhaar | PAN | DrivingLicense>; // Will this Work? if not add fixed types or use any

  @prop({ ref: () => User })
  user!: Ref<User>;

  @prop({ type: () => Verification })
  public verification!: Verification;
}

export const DocumentModel = getModelForClass(Document);
export const AadhaarModel = getModelForClass(Aadhaar);
export const PANModel = getModelForClass(PAN);
export const DrivingLicenseModel = getModelForClass(DrivingLicense);
