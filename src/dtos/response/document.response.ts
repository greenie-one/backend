import { DocumentType } from "../request/document.dto";

export interface GetDocumentResponseDto {
  id: string;
  name: string;
  type: DocumentType;
  privateUrl: string;
}

