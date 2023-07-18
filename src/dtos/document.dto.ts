import { DocumentType } from '@/models/document.model';
import { IsEnum, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

export class createDocumentDto {
  @IsNotEmpty()
  @IsString()
  public name: string;

  @IsNotEmpty()
  @IsEnum(DocumentType)
  public type: DocumentType;

  @IsNotEmpty()
  @IsString()
  public privateUrl: string;

  @ValidateIf((o) => o.type === DocumentType.WORK)
  @IsNotEmpty()
  @IsString()
  public workExperience?: string;
}

export class updateDocumentDto {
  @IsString()
  @IsOptional()
  public name: string;

  @IsEnum(DocumentType)
  @IsOptional()
  public type: DocumentType;

  @IsString()
  @IsOptional()
  public privateUrl: string;
}

export interface getDocumentResponseDto {
  id: string;
  name: string;
  type: DocumentType;
  privateUrl: string;
}
