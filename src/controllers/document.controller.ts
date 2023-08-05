import { TokenClaims } from '@/dtos/request/auth.dto';
import { CreateDocumentDto, DocumentType, UpdateDocumentDto } from '@/dtos/request/document.dto';
import { CreateDocumentResponse, DeleteDocumentResponse, GetDocumentResponse, GetDocumentsResponse, UpdateDocumentResponse } from '@/dtos/response/document.response';
import { documentService } from '@/services/document.service';
import { UserDetails } from '@/utils/decorators/auth';
import { Controller } from '@/utils/decorators/controller';
import { Delete, Get, Patch, Post } from '@/utils/decorators/methods';
import { Body, Params } from '@/utils/decorators/request';

@Controller('/documents')
export default class DocumentController {
  @Post('/create')
  async createDocument(@UserDetails() userDetails: TokenClaims, @Body() data: CreateDocumentDto): Promise<CreateDocumentResponse> {
    return documentService.createDocument(userDetails.sub, data);
  }

  @Patch('/:id')
  async updateDocument(
    @UserDetails() userDetails: TokenClaims,
    @Params('id') documentId: string,
    @Body() data: UpdateDocumentDto,
  ): Promise<UpdateDocumentResponse> {
    return documentService.updateDocument(userDetails.sub, documentId, data);
  }

  @Delete('/:id')
  async deleteDocument(@UserDetails() userDetails: TokenClaims, @Params('id') documentId: string): Promise<DeleteDocumentResponse> {
    return documentService.deleteDocument(userDetails.sub, documentId);
  }

  @Get('/me')
  async getDocuments(@UserDetails() userDetails: TokenClaims): Promise<GetDocumentsResponse> {
    return documentService.getDocuments(userDetails.sub);
  }

  @Get('/me/:type')
  async getDocument(@UserDetails() userDetails: TokenClaims, @Params('type') DocumentType: DocumentType): Promise<GetDocumentsResponse> {
    return documentService.getDocumentByType(userDetails.sub, DocumentType);
  }

  @Get('/:id')
  async getDocumentById(@UserDetails() userDetails: TokenClaims, @Params('id') documentId: string): Promise<GetDocumentResponse> {
    return documentService.getDocumentById(userDetails.sub, documentId);
  }
}
