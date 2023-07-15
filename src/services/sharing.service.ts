import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';

import { DocumentSharing, DocumentSharingModel } from '@/models/sharing.model';

class documentsSharingService {
  public async newPrivateDocument(userId: string, documentId: string): Promise<void> {
    await DocumentSharingModel.create({
      user: userId,
      document: documentId,
    });
  }

  public async shareDocument(userId: string, documentId: string, shareId: string): Promise<void> {
    const document = await DocumentSharingModel.findOne({ user: userId, document: documentId });
    if (!document) {
      throw new HttpException(ErrorEnum.DOCUMENT_IS_PUBLIC);
    }

    if (document.sharedWith?.includes(shareId)) {
      throw new HttpException(ErrorEnum.DOCUMENT_ALREADY_SHARED);
    }
    document.sharedWith?.push(shareId);
    await document.save();
  }

  public async unshareDocument(userId: string, documentId: string, shareId: string): Promise<void> {
    const document = await DocumentSharingModel.findOne({ user: userId, document: documentId });

    if (!document) {
      throw new HttpException(ErrorEnum.DOCUMENT_IS_PUBLIC);
    }

    if (!document.sharedWith?.includes(shareId)) {
      throw new HttpException(ErrorEnum.DOCUMENT_NOT_SHARED);
    }

    document.sharedWith?.splice(document.sharedWith?.indexOf(shareId), 1);
    await document.save();
  }

  public async getSharedDocuments(userId: string): Promise<DocumentSharing[]> {
    const documents = await DocumentSharingModel.find({ user: userId }).populate('document');
    return documents.filter((document) => document.sharedWith?.length !== 0);
  }
}

export const DocumentsSharingService = new documentsSharingService();
