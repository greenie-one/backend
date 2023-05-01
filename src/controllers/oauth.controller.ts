import { LinkedInOAuthDto } from '@/dtos/oauth.dto';
import { oAuthService } from '@/services/oauth.service';
import { Controller } from '@/utils/decorators/controller';
import { Get } from '@/utils/decorators/methods';
import { Query, Req } from '@/utils/decorators/request';
import { FastifyRequest } from 'fastify';

@Controller('/oauth')
export class OAuthController {
  @Get('/linkedInRedirect')
  async getLinkedInRedirectionURL() {
    return { url: oAuthService.getLinkedInRedirectURL() };
  }

  @Get('/linkedInCallback')
  async handleLinkedInCallback(@Query() query: LinkedInOAuthDto, @Req() request: FastifyRequest) {
    return oAuthService.handleLinkedInLogin(request, query);
  }
}
