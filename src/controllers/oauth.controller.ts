import { LinkedInOAuthDto } from '@/dtos/oauth.dto';
import { oAuthService } from '@/services/oauth.service';
import { Controller } from '@/utils/decorators/controller';
import { Get } from '@/utils/decorators/methods';
import { Query } from '@/utils/decorators/request';

@Controller('/oauth')
export class OAuthController {
  @Get('/linkedIn')
  async handleLinkedInCallback(@Query() query: LinkedInOAuthDto) {
    return oAuthService.handleLinkedInLogin(query);
  }
}
