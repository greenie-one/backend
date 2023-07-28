import { DocumentType } from '@/dtos/request/document.dto';
import { IDTypeEnum } from '@/dtos/request/ids.dto';

export const documentWeights: Record<DocumentType | IDTypeEnum, number> = {
  [DocumentType.EDUCATION]: 1,
  [DocumentType.OTHER]: 1,
  [DocumentType.WORK]: 1,
  [DocumentType.ID]: 2,
  [IDTypeEnum.AADHAR]: 3,
  [IDTypeEnum.DRIVING_LICENSE]: 2,
  [IDTypeEnum.PAN]: 2,
};

export const scoreConstant = 1000;
