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
    const old_doc = await DocumentModel.findOne({ _id: documentId });
    if (!old_doc) {
      throw new HttpException(ErrorEnum.DOCUMENT_NOT_FOUND);
    }
    const updated_doc = old_doc;
    for (const key in documentData) {
      if (key !== 'document_id') {
        updated_doc[key] = documentData[key];
      }
    }
    await updated_doc.save();
    return updated_doc;
  }
}

export const documentsService = new DocumentsService();
