import { LinkedInOAuthDto } from '@/dtos/oauth.dto';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { oAuthService } from '@/services/oauth.service';
import { Controller } from '@/utils/decorators/controller';
import { Get } from '@/utils/decorators/methods';
import { Params, Query, Req } from '@/utils/decorators/request';
import { FastifyRequest } from 'fastify';

@Controller('/oauth')
export class OAuthController {
  @Get('/:provider/redirect')
  async getLinkedInRedirectionURL(@Params('provider') provider: string) {
    let providerService: IOAuthService;
    try {
      providerService = oAuthService.RegisteredOAuthProviders[provider as OAuthProviders];
    } catch (e) {
      throw new HttpException(ErrorEnum.OAUTH_PROVIDER_NOT_FOUND);
    }
    return { url: providerService.getRedirectURL() };
  }

  @Get('/:provider/callback')
  async handleLinkedInCallback(@Params('provider') provider: string, @Query() query: LinkedInOAuthDto, @Req() request: FastifyRequest) {
    let providerService: IOAuthService;
    try {
      providerService = oAuthService.RegisteredOAuthProviders[provider as OAuthProviders];
    } catch (e) {
      throw new HttpException(ErrorEnum.OAUTH_PROVIDER_NOT_FOUND);
    }
    return providerService.handleLogin(request, query);
  }
}
