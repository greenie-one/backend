import { TokenClaims } from '@/dtos/auth.dto';

import { AuthGuard, UserDetails } from '@/utils/decorators/auth';
import { Controller } from '@/utils/decorators/controller';
import { Get, Patch, Post } from '@/utils/decorators/methods';
import { Body } from '@/utils/decorators/request';

import { AddDocumentDto, UpdateDocumentDto } from '@/dtos/documents.dto';

import { documentsService } from '@/services/documents.service';

@Controller('/documents')
export default class DocumentsController {
  @Get('/me')
  @AuthGuard()
  public async getUserDocuments(@UserDetails() userDetails: TokenClaims) {
    const userId = userDetails.userId;
    const documents = await documentsService.getUserDocuments(userId);
    return { documents };
  }

  @Post('/')
  @AuthGuard()
  public async addDocument(@UserDetails() userDetails: TokenClaims, @Body() documentData: AddDocumentDto) {
    const userId = userDetails.userId;
    const document = await documentsService.addDocument(userId, documentData);
    return { document };
  }

  @Patch('/')
  @AuthGuard()
  public async updateDocument(@UserDetails() userDetails: TokenClaims, @Body() documentData: UpdateDocumentDto) {
    const userId = userDetails.userId;
    const document = await documentsService.updateDocument(userId, documentData);
    return { document };
  }
}
