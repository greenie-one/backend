import { DocumentType } from '@/models/document.model';
import { IDTypeEnum } from '@/models/id.model';

export const documentWeights: Record<DocumentType | IDTypeEnum, number> = {
  [DocumentType.CERIFICATE]: 1,
  [DocumentType.EDUCATION]: 1,
  [DocumentType.MARKSHEET]: 1,
  [DocumentType.OTHER]: 1,
  [DocumentType.TAX]: 1,
  [DocumentType.WORK]: 1,
  [IDTypeEnum.AADHAR]: 3,
  [IDTypeEnum.DRIVING_LICENSE]: 2,
  [IDTypeEnum.PAN]: 2,
};

export const scoreConstant = 1000;
