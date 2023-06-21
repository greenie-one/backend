import { createDocumentDto, updateDocumentDto } from '@/dtos/document.dto';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { Document, DocumentModel, DocumentType } from '@/models/document.model';
import { redisUtilClient } from '@/redisClient';

class DocumentService {
  public async createDocument(userID: string, documentData: createDocumentDto): Promise<Document> {
    const data = await redisUtilClient.get(documentData.url);
    if (!data) {
      throw new HttpException(ErrorEnum.DOCUMENT_NOT_FOUND);
    }

    if (JSON.parse(data).commited) {
      throw new HttpException(ErrorEnum.DOCUMENT_ALREADY_UPLOADED);
    }
    const timeDifference = Date.now() - JSON.parse(data).upload_time;
    if (timeDifference > 400000) {
      throw new HttpException(ErrorEnum.DOCUMENT_EXPIRED);
    }

    if (data) {
      const newDocument = await DocumentModel.create({
        ...documentData,
        user: userID,
      });
      const updatedData = JSON.parse(data);
      updatedData.commited = true;
      await redisUtilClient.set(documentData.url, JSON.stringify(updatedData));
      return newDocument;
    } else {
      throw new HttpException(ErrorEnum.DOCUMENT_NOT_FOUND);
    }
  }

  public async updateDocument(userID: string, documentId: string, documentData: updateDocumentDto): Promise<Document> {
    const document = await DocumentModel.findById(documentId);
    if (!document) {
      throw new HttpException(ErrorEnum.DOCUMENT_NOT_FOUND);
    }

    if (document.user.toString() !== userID) {
      throw new HttpException(ErrorEnum.UNAUTHORIZED);
    }

    if (documentData.url) {
      const data = await redisUtilClient.get(documentData.url);

      if (!data) {
        throw new HttpException(ErrorEnum.DOCUMENT_NOT_FOUND);
      }

      if (JSON.parse(data).commited) {
        throw new HttpException(ErrorEnum.DOCUMENT_ALREADY_UPLOADED);
      }
      const timeDifference = Date.now() - JSON.parse(data).upload_time;
      if (timeDifference > 400000) {
        throw new HttpException(ErrorEnum.DOCUMENT_EXPIRED);
      }
    }
    const updatedDocument = await DocumentModel.findByIdAndUpdate(documentId, { $set: documentData }, { new: true });

    if (documentData.url && updatedDocument) {
      const data = await redisUtilClient.get(documentData.url);
      const updatedData = JSON.parse(data);
      updatedData.commited = false;
      await redisUtilClient.set(documentData.url, JSON.stringify(updatedData));
    }

    if (!updatedDocument) {
      throw new HttpException(ErrorEnum.DOCUMENT_NOT_FOUND);
    }

    return updatedDocument;
  }

  public async deleteDocument(userID: string, documentId: string) {
    const documentToDelete = await this.getDocumentById(documentId);
    if (!documentToDelete) {
      throw new HttpException(ErrorEnum.DOCUMENT_NOT_FOUND);
    }

    if (documentToDelete.user.toString() !== userID) {
      throw new HttpException(ErrorEnum.UNAUTHORIZED);
    }

    await documentToDelete.deleteOne();

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
