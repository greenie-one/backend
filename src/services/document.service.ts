import { CreateDocumentDto, DocumentType, UpdateDocumentDto } from '@/dtos/request/document.dto';
import {
  CreateDocumentResponse,
  DeleteDocumentResponse,
  GetDocumentResponse,
  GetDocumentsResponse,
  UpdateDocumentResponse,
} from '@/dtos/response/document.response';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { Document, DocumentModel } from '@/models/document.model';
import { redisUtilClient } from '@/redisClient';
import { RedisPUBSUB } from '@/redisClient/deleteService';
import { SAStokenService } from './blobStorage.service';
import { profileService } from './profile.service';

class DocumentService {
  public async createDocument(userID: string, documentData: CreateDocumentDto): Promise<CreateDocumentResponse> {
    const data = await redisUtilClient.get(documentData.privateUrl);
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
      } as Document);
      const updatedData = JSON.parse(data);
      updatedData.commited = true;
      await redisUtilClient.set(documentData.privateUrl, JSON.stringify(updatedData));

      // Update score based on document uploaded
      await profileService.modScore(userID, documentData.type, true);

      return {
        id: newDocument._id.toString(),
        name: newDocument.name,
        type: newDocument.type,
        user: newDocument.user.toString(),
        createdAt: newDocument.createdAt,
        updatedAt: newDocument.updatedAt,
        privateUrl: newDocument.privateUrl,
      };
    } else {
      throw new HttpException(ErrorEnum.DOCUMENT_NOT_FOUND);
    }
  }

  public async updateDocument(userID: string, documentId: string, documentData: UpdateDocumentDto): Promise<UpdateDocumentResponse> {
    const document = await DocumentModel.findById(documentId);
    if (!document) {
      throw new HttpException(ErrorEnum.DOCUMENT_NOT_FOUND);
    }

    if (document.user.toString() !== userID) {
      throw new HttpException(ErrorEnum.UNAUTHORIZED);
    }

    if (documentData.privateUrl) {
      const data = await redisUtilClient.get(documentData.privateUrl);

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

      const fileName = documentData.privateUrl.split(`${userID}/`);
      await RedisPUBSUB.docDelete(fileName[1], userID);
    }
    const updatedDocument = await DocumentModel.findByIdAndUpdate(documentId, { $set: documentData }, { new: true });

    if (documentData.privateUrl && updatedDocument) {
      const data = await redisUtilClient.get(documentData.privateUrl);
      const updatedData = JSON.parse(data);
      updatedData.commited = false;
      await redisUtilClient.set(documentData.privateUrl, JSON.stringify(updatedData));
    }

    if (!updatedDocument) {
      throw new HttpException(ErrorEnum.DOCUMENT_NOT_FOUND);
    }

    return {
      id: updatedDocument._id.toString(),
      name: updatedDocument.name,
      type: updatedDocument.type,
      user: updatedDocument.user.toString(),
      createdAt: updatedDocument.createdAt,
      updatedAt: updatedDocument.updatedAt,
      privateUrl: updatedDocument.privateUrl,
    };
  }

  public async deleteDocument(userID: string, documentId: string): Promise<DeleteDocumentResponse> {
    const documentToDelete = await DocumentModel.findById(documentId);
    if (!documentToDelete) {
      throw new HttpException(ErrorEnum.DOCUMENT_NOT_FOUND);
    }

    if (documentToDelete.user.toString() !== userID) {
      throw new HttpException(ErrorEnum.UNAUTHORIZED);
    }

    await documentToDelete.deleteOne();
    const fileName = documentToDelete.privateUrl.split(`${userID}/`);
    await RedisPUBSUB.docDelete(fileName[1], userID);

    // Update score based on document deleted
    await profileService.modScore(userID, documentToDelete.type, false);

    return {};
  }

  public async getDocuments(userID: string): Promise<GetDocumentsResponse> {
    const documents = await DocumentModel.find({ user: userID });
    const sasToken = await SAStokenService.getSASTokenUser(userID);

    if (!documents) {
      throw new HttpException(ErrorEnum.DOCUMENTS_NOT_FOUND);
    }

    for (let index = 0; index < documents.length; index++) {
      documents[index].privateUrl = `${documents[index].privateUrl}?${sasToken}`;
    }

    return documents.map((document) => ({
      id: document._id.toString(),
      name: document.name,
      type: document.type,
      user: document.user.toString(),
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
      privateUrl: document.privateUrl,
    }));
  }

  public async getDocumentByType(userID: string, type: DocumentType): Promise<GetDocumentsResponse> {
    const documents = await DocumentModel.find({ user: userID, type: type });
    const sasToken = await SAStokenService.getSASTokenUser(userID);
    if (!documents) {
      throw new HttpException(ErrorEnum.DOCUMENT_NOT_FOUND);
    }
    for (let index = 0; index < documents.length; index++) {
      documents[index].privateUrl = `${documents[index].privateUrl}?${sasToken}`;
    }
    return documents.map((document) => ({
      id: document._id.toString(),
      name: document.name,
      type: document.type,
      user: document.user.toString(),
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
      privateUrl: document.privateUrl,
    }));
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
      user: document.user?.toString(),
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };

    return resp;
  }
}

export const documentService = new DocumentService();
