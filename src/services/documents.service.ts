import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';

import { AddDocumentDto, UpdateDocumentDto } from '@/dtos/documents.dto';
import { Document, DocumentModel } from '@/models/documents.model';

class DocumentsService {
  public async getUserDocuments(userId: string): Promise<Document[]> {
    const document: Document[] = await DocumentModel.find({ user: userId });
    if (!document) {
      throw new HttpException(ErrorEnum.DOCUMENTS_NOT_FOUND);
    }
    return document;
  }

  public async addDocument(userId: string, documentData: AddDocumentDto): Promise<Document> {
    const document = await DocumentModel.create({
      ...documentData,
      user: userId,
    });
    return document;
  }

  public async updateDocument(userId: string, documentData: UpdateDocumentDto): Promise<Document> {
    const documentId = documentData.document_id;
    delete documentData.document_id;
    const document = await DocumentModel.findOneAndUpdate({ _id: documentId, user: userId }, documentData, { new: true });
    if (!document) {
      throw new HttpException(ErrorEnum.DOCUMENTS_NOT_FOUND);
    }
    return document;
  }
}

export const documentsService = new DocumentsService();
