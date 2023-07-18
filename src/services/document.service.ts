import { createDocumentDto, getDocumentResponseDto, updateDocumentDto } from '@/dtos/document.dto';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { Document, DocumentModel, DocumentType } from '@/models/document.model';
import { WorkExperienceModel } from '@/models/workExperience.model';
import { redisUtilClient } from '@/redisClient';
import { RedisPUBSUB } from '@/redisClient/deleteService';
import { SAStokenService } from './blobStorage.service';
import { profileService } from './profile.service';

class DocumentService {
  public async createDocument(userID: string, documentData: createDocumentDto): Promise<Document> {
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
      if (documentData.workExperience) {
        const workex = await WorkExperienceModel.findById(documentData.workExperience, { user: userID });
        if (!workex) {
          throw new HttpException(ErrorEnum.WORKEXPERIENCE_NOT_FOUND);
        }
      }
      const newDocument = await DocumentModel.create({
        ...documentData,
        user: userID,
      } as Document);
      const updatedData = JSON.parse(data);
      updatedData.commited = true;
      await redisUtilClient.set(documentData.privateUrl, JSON.stringify(updatedData));

      // Update score based on document uploaded
      await profileService.modScore(userID, documentData.type, true);

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

    if (documentData.workExperience) {
      const workex = await WorkExperienceModel.findById(documentData.workExperience, { user: userID });
      if (!workex) {
        throw new HttpException(ErrorEnum.WORKEXPERIENCE_NOT_FOUND);
      }
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

      const fileName = documentData.privateUrl.split(userID + '/');
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
    const fileName = documentToDelete.privateUrl.split(userID + '/');
    await RedisPUBSUB.docDelete(fileName[1], userID);

    // Update score based on document deleted
    await profileService.modScore(userID, documentToDelete.type, false);

    return { message: 'Document deleted successfully' };
  }

  public async getDocuments(userID: string) {
    const documents: Document[] = await DocumentModel.find({ user: userID });
    const sasToken = await SAStokenService.getSASTokenUser(userID);

    if (!documents) {
      throw new HttpException(ErrorEnum.DOCUMENTS_NOT_FOUND);
    }

    for (let index = 0; index < documents.length; index++) {
      documents[index].privateUrl = documents[index].privateUrl + '?' + sasToken;
    }

    return documents;
  }

  public async getDocumentByType(userID: string, type: DocumentType): Promise<Document[]> {
    const documents: Document[] = await DocumentModel.find({ user: userID, type: type });
    const sasToken = await SAStokenService.getSASTokenUser(userID);
    if (!documents) {
      throw new HttpException(ErrorEnum.DOCUMENT_NOT_FOUND);
    }
    for (let index = 0; index < documents.length; index++) {
      documents[index].privateUrl = documents[index].privateUrl + '?' + sasToken;
    }
    return documents;
  }

  public async getDocumentById(userId: string, id: string): Promise<getDocumentResponseDto> {
    const document = await DocumentModel.findById(id);

    if (!document) {
      throw new HttpException(ErrorEnum.DOCUMENTS_NOT_FOUND);
    }

    const resp: getDocumentResponseDto = {
      id: document._id.toString(),
      name: document.name,
      type: document.type,
      privateUrl: document.privateUrl,
    };

    return resp;
  }
}

export const documentService = new DocumentService();
