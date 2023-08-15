import { CreateDocumentDto, DocumentType, UpdateDocumentDto } from '@/dtos/request/document.dto';
import { GetDocumentResponse } from '@/dtos/response/document.response';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { Document, DocumentModel } from '@/models/document.model';
import { blobService } from './blobStorage.service';
import { profileService } from './profile.service';

class DocumentService {
  public async createDocument(userID: string, documentData: CreateDocumentDto): Promise<Document> {
    const fileName = documentData.privateUrl.split('/').pop();
    if (blobService.doesBlobExist(userID, fileName)) {
      throw new HttpException(ErrorEnum.DOCUMENTS_NOT_FOUND);
    }

    const newDocument = await DocumentModel.create({
      ...documentData,
      user: userID,
    } as Document);

    // Update score based on document uploaded
    await profileService.modScore(userID, documentData.type, true);

    return newDocument;
  }

  public async updateDocument(userID: string, documentId: string, documentData: UpdateDocumentDto): Promise<Document> {
    const document = await DocumentModel.findById(documentId);
    if (!document) {
      throw new HttpException(ErrorEnum.DOCUMENT_NOT_FOUND);
    }

    if (document.user.toString() !== userID) {
      throw new HttpException(ErrorEnum.UNAUTHORIZED);
    }

    if (documentData.privateUrl) {
      const fileName = documentData.privateUrl.split('/').pop();
      if (blobService.doesBlobExist(userID, fileName)) {
        throw new HttpException(ErrorEnum.DOCUMENTS_NOT_FOUND);
      }
    }
    const updatedDocument = await DocumentModel.findByIdAndUpdate(documentId, { $set: documentData }, { new: true });
    if (!updatedDocument) {
      throw new HttpException(ErrorEnum.DOCUMENT_NOT_FOUND);
    }

    return updatedDocument;
  }

  public async deleteDocument(userID: string, documentId: string) {
    const documentToDelete = await DocumentModel.findById(documentId);
    if (!documentToDelete) {
      throw new HttpException(ErrorEnum.DOCUMENT_NOT_FOUND);
    }

    if (documentToDelete.user.toString() !== userID) {
      throw new HttpException(ErrorEnum.UNAUTHORIZED);
    }

    await documentToDelete.deleteOne();
    const fileName = documentToDelete.privateUrl.split(`${userID}/`);
    await blobService.deleteBlob(userID, fileName[1]);

    // Update score based on document deleted
    await profileService.modScore(userID, documentToDelete.type, false);

    return { message: 'Document deleted successfully' };
  }

  public async getDocuments(userID: string) {
    const documents: Document[] = await DocumentModel.find({ user: userID });

    if (!documents) {
      throw new HttpException(ErrorEnum.DOCUMENTS_NOT_FOUND);
    }

    return documents;
  }

  public async getDocumentByType(userID: string, type: DocumentType): Promise<Document[]> {
    const documents: Document[] = await DocumentModel.find({ user: userID, type: type });
    if (!documents) {
      throw new HttpException(ErrorEnum.DOCUMENT_NOT_FOUND);
    }
    return documents;
  }

  public async getDocumentById(userId: string, id: string): Promise<GetDocumentResponse> {
    const document = await DocumentModel.findById(id);

    if (!document) {
      throw new HttpException(ErrorEnum.DOCUMENTS_NOT_FOUND);
    }

    if (document.user.toString() !== userId) {
      throw new HttpException(ErrorEnum.UNAUTHORIZED);
    }

    const resp: GetDocumentResponse = {
      id: document._id.toString(),
      name: document.name,
      type: document.type,
      privateUrl: document.privateUrl,
    };

    return resp;
  }
}

export const documentService = new DocumentService();
