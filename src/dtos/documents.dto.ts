import { DocumentTypeEnum } from '@/models/documents.model';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddDocumentDto {
  @IsEnum(DocumentTypeEnum)
  @IsNotEmpty()
  public document_type!: DocumentTypeEnum;

  @IsString()
  @IsNotEmpty()
  public document_number!: string;

  @IsString()
  @IsNotEmpty()
  public doument_data!: string;
}

export class UpdateDocumentDto {
  @IsEnum(DocumentTypeEnum)
  @IsNotEmpty()
  @IsOptional()
  public document_type?: DocumentTypeEnum;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public document_number?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public doument_data?: string;

  @IsString()
  @IsNotEmpty()
  public document_id!: string;
}
