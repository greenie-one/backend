import { GoogleOAuthDto, LinkedInOAuthDto } from '@/dtos/oauth.dto';
import { OAuthProviders, oAuthService } from '@/services/oauth.services/index.service';
import { Controller } from '@/utils/decorators/controller';
import { Get } from '@/utils/decorators/methods';
import { Params, Query, Reply, Req } from '@/utils/decorators/request';
import { FastifyReply, FastifyRequest } from 'fastify';

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
    @Reply() reply: FastifyReply,
  ) {
    const redirect_uri = await oAuthService.handleOAuthLogin(provider, request, query);
    return reply.redirect(redirect_uri);
  }
}
