import { DocumentType } from '@/models/document.model';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class createDocumentDto {
  @IsNotEmpty()
  @IsString()
  public name: string;

  @IsNotEmpty()
  @IsEnum(DocumentType)
  public type: DocumentType;

  @IsNotEmpty()
  @IsString()
  public private_url: string;
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
  public private_url: string;
}
