import { GoogleOAuthDto, LinkedInOAuthDto } from '@/dtos/oauth.dto';
import { OAuthProviders, oAuthService } from '@/services/oauth.services/index.service';
import { Controller } from '@/utils/decorators/controller';
import { Get } from '@/utils/decorators/methods';
import { Params, Query, Req } from '@/utils/decorators/request';
import { FastifyRequest } from 'fastify';

@Controller('/oauth')
export class OAuthController {
  @Get('/:provider/redirect')
  async getLinkedInRedirectionURL(@Params('provider') provider: OAuthProviders) {
    return { url: oAuthService.getOAuthRedirectURL(provider) };
  }

  @Get('/:provider/callback')
  async handleLinkedInCallback(
    @Params('provider') provider: OAuthProviders,
    @Query() query: GoogleOAuthDto | LinkedInOAuthDto,
    @Req() request: FastifyRequest,
  ) {
    const token = await oAuthService.handleOAuthLogin(provider, request, query);
    console.log(token);
  }
}
