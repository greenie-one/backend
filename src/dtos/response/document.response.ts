import { DocumentType } from '@/models/document.model';

export interface GetDocumentResponseDto {
  id: string;
  name: string;
  type: DocumentType;
  privateUrl: string;
}

