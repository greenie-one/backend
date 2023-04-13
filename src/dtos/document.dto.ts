import { IsEnum, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { DocumentTypeEnum } from '../models/documents.model';

// DTO for Aadhaar document
export class AadhaarDto {
  @IsString()
  @IsNotEmpty()
  public aadhaarNumber: string;
}

// DTO for PAN document
export class PANDto {
  @IsString()
  @IsNotEmpty()
  public panNumber: string;
}

// DTO for Driving License document
export class DrivingLicenseDto {
  @IsString()
  @IsNotEmpty()
  public licenseNumber: string;
}

// Wrapper DTO for all the documents, will work???
export class CreateDocumentDto {
  @IsEnum(DocumentTypeEnum)
  @IsNotEmpty()
  public type!: DocumentTypeEnum;

  @ValidateNested()
  public document: AadhaarDto | PANDto | DrivingLicenseDto;
}
