import { TokenClaims } from '@/dtos/auth.dto';
import { createDocumentDto, updateDocumentDto } from '@/dtos/document.dto';
import { DocumentType } from '@/models/document.model';
import { documentService } from '@/services/document.service';
import { UserDetails } from '@/utils/decorators/auth';
import { Controller } from '@/utils/decorators/controller';
import { Delete, Get, Patch, Post } from '@/utils/decorators/methods';
import { Body, Params } from '@/utils/decorators/request';

@Controller('/documents')
export default class DocumentController {
  @Post('/create')
  async createDocument(@UserDetails() userDetails: TokenClaims, @Body() data: createDocumentDto) {
    return documentService.createDocument(userDetails.sub, data);
  }

  @Patch('/:id')
  async updateDocument(@UserDetails() userDetails: TokenClaims, @Params('id') documentId: string, @Body() data: updateDocumentDto) {
    return documentService.updateDocument(userDetails.sub, documentId, data);
  }

  @Delete('/:id')
  async deleteDocument(@UserDetails() userDetails: TokenClaims, @Params('id') documentId: string) {
    return documentService.deleteDocument(userDetails.sub, documentId);
  }

  @Get('/:id')
  async getDocuments(@UserDetails() userDetails: TokenClaims) {
    return documentService.getDocuments(userDetails.sub);
  }

  @Get('/me/:type')
  async getDocument(@UserDetails() userDetails: TokenClaims, @Params('type') DocumentType: DocumentType) {
    return documentService.getDocumentByType(userDetails.sub, DocumentType);
  }

  @Get('/:id')
  async getDocumentById(@UserDetails() userDetails: TokenClaims, @Params('id') documentId: string) {
    return documentService.getDocumentById(userDetails.sub, documentId);
  }
}
