import { TokenClaims } from '@/dtos/request/auth.dto';
import { CreateDocumentDto, DocumentType, UpdateDocumentDto } from '@/dtos/request/document.dto';
import { documentService } from '@/services/document.service';
import { UserDetails } from '@/utils/decorators/auth';
import { Controller } from '@/utils/decorators/controller';
import { Delete, Get, Patch, Post } from '@/utils/decorators/methods';
import { Body, Params } from '@/utils/decorators/request';

@Controller('/documents')
export default class DocumentController {
  @Post('/create')
  async createDocument(@UserDetails() userDetails: TokenClaims, @Body() data: CreateDocumentDto) {
    return documentService.createDocument(userDetails.sub, data);
  }

  @Patch('/:id')
  async updateDocument(@UserDetails() userDetails: TokenClaims, @Params('id') documentId: string, @Body() data: UpdateDocumentDto) {
    return documentService.updateDocument(userDetails.sub, documentId, data);
  }

  @Delete('/:id')
  async deleteDocument(@UserDetails() userDetails: TokenClaims, @Params('id') documentId: string) {
    return documentService.deleteDocument(userDetails.sub, documentId);
  }

  @Get('/')
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
