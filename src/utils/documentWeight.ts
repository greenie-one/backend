import { DocumentType } from '@/dtos/request/document.dto';
import { IDTypeEnum } from '@/dtos/request/ids.dto';

export const documentWeights: Record<DocumentType | IDTypeEnum, number> = {
  [DocumentType.CERTIFICATE]: 1,
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
