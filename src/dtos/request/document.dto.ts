import { IsObjectId } from '@/utils/validation';
import { IsEnum, IsNotEmpty, IsOptional, IsString, Validate, ValidateIf } from 'class-validator';

export enum DocumentType {
  WORK = 'work',
  ID = 'id',
  EDUCATION = 'education',
  OTHER = 'other',
}

export class CreateDocumentDto {
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
  @Validate(IsObjectId)
  public workExperience?: string;
}

export class UpdateDocumentDto {
  @IsString()
  @IsOptional()
  public name: string;

  @IsEnum(DocumentType)
  @IsOptional()
  public type: DocumentType;

  @IsString()
  @IsOptional()
  public privateUrl: string;

  @ValidateIf((o) => o.type === DocumentType.WORK)
  @IsNotEmpty()
  @IsString()
  @Validate(IsObjectId)
  public workExperience?: string;
}
