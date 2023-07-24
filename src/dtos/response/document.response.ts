import { DocumentType } from '../request/document.dto';

export interface GetDocumentResponse {
  id: string;
  name: string;
  type: DocumentType;
  privateUrl: string;
}
