import { AadhaarDto, CreateDocumentDto, DrivingLicenseDto, PANDto } from '@/dtos/document.dto';
import { HttpException } from '@/exceptions/httpException';
import {
  Aadhaar,
  AadhaarModel,
  Document,
  DocumentModel,
  DocumentTypeEnum,
  DrivingLicense,
  DrivingLicenseModel,
  PAN,
  PANModel,
} from '@/models/documents.model';
import { UserModel } from '@/models/users.model';

export class DocumentService {
  public async createDocument(user: string, documentData: CreateDocumentDto): Promise<Document> {
    // Check if user exists
    const findUser = await UserModel.findById(user);
    if (!findUser) {
      throw new HttpException('User not found', 404);
    }

    // Create document based on document type
    let document: Aadhaar | PAN | DrivingLicense;
    switch (documentData.type) {
      case DocumentTypeEnum.Aadhaar:
        const aadharSubDoc = documentData.document as AadhaarDto;
        document = await AadhaarModel.create({ aadhaarNumber: aadharSubDoc.aadhaarNumber });
        break;
      case DocumentTypeEnum.PAN:
        const panSubDoc = documentData.document as PANDto;
        document = await PANModel.create({ panNumber: panSubDoc.panNumber });
        break;
      case DocumentTypeEnum.DrivingLicense:
        const drivingLicenseSubDoc = documentData.document as DrivingLicenseDto;
        document = await DrivingLicenseModel.create({ licenseNumber: drivingLicenseSubDoc.licenseNumber });
        break;
      default:
        throw new HttpException('Invalid document type', 400);
    }

    // Create document entry in DocumentModel
    const createdDocument = await DocumentModel.create({
      type: documentData.type,
      document: document._id,
      user: user,
    });

    return createdDocument;
  }

  public async getDocuments(user: string): Promise<Document[]> {
    const document = await DocumentModel.find({ user: user }).populate('document');
    if (!document) {
      throw new HttpException('Document not found', 404);
    }
    return document;
  }

  public async updateDocument(documentId: string, documentData: CreateDocumentDto): Promise<Document> {
    const document = await DocumentModel.findByIdAndUpdate(documentId, documentData, { new: true }).populate('document');
    if (!document) {
      throw new HttpException('Document not found', 404);
    }
    return document;
  }

  public async deleteDocument(documentId: string): Promise<void> {
    const document = await DocumentModel.findByIdAndDelete(documentId);
    if (!document) {
      throw new HttpException('Document not found', 404);
    }
  }
}
