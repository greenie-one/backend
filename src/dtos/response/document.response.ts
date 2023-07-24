import { DocumentType } from '../request/document.dto';

export interface CreateDocumentResponse {
  id: string;
  name: string;
  type: DocumentType;
  user: string;
  privateUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export type GetDocumentsResponse = CreateDocumentResponse[];
export type UpdateDocumentResponse = CreateDocumentResponse;
export type DeleteDocumentResponse = Record<string, never>;
