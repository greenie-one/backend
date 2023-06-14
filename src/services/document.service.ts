import { createDocumentDto, updateDocumentDto } from '@/dtos/document.dto';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { Document, DocumentModel, DocumentType } from '@/models/document.model';

class DocumentService {
  public async createDocument(userID: string, documentData: createDocumentDto): Promise<Document> {
    const newDocument = await DocumentModel.create({
      ...documentData,
      user: userID,
    });
    return newDocument;
  }

  public async updateDocument(userID: string, documentId: string, documentData: updateDocumentDto): Promise<Document> {
    const document = await DocumentModel.findById(documentId);
    if (!document) {
      throw new HttpException(ErrorEnum.DOCUMENT_NOT_FOUND);
    }

    if (document.user.toString() !== userID) {
      throw new HttpException(ErrorEnum.UNAUTHORIZED);
    }

    const updatedDocument = await DocumentModel.findByIdAndUpdate(documentId, { $set: documentData }, { new: true });

    if (!updatedDocument) {
      throw new HttpException(ErrorEnum.DOCUMENT_NOT_FOUND);
    }

    return updatedDocument;
  }

  public async deleteDocument(userID: string, documentId: string) {
    const documenntToDelete = await this.getDocumentById(documentId);
    if (!documenntToDelete) {
      throw new HttpException(ErrorEnum.DOCUMENT_NOT_FOUND);
    }

    if (documenntToDelete.user.toString() !== userID) {
      throw new HttpException(ErrorEnum.UNAUTHORIZED);
    }

    await documenntToDelete.deleteOne();

    return { message: 'Document deleted successfully' };
  }

  public async getDocumentById(documentId: string) {
    const document = await DocumentModel.findById(documentId);

    if (!document) {
      throw new HttpException(ErrorEnum.DOCUMENT_NOT_FOUND);
    }

    return document;
  }

  public async getDocumentByType(userID: string, type: DocumentType): Promise<Document[]> {
    const documents: Document[] = await DocumentModel.find({ user: userID, type: type });
    if (!documents) {
      throw new HttpException(ErrorEnum.DOCUMENT_NOT_FOUND);
    }
    return documents;
  }
}

export const documentService = new DocumentService();
