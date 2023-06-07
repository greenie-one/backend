import { TokenClaims } from '@/dtos/auth.dto';

import { UserDetails } from '@/utils/decorators/auth';
import { Controller } from '@/utils/decorators/controller';
import { Get } from '@/utils/decorators/methods';

import { idsService } from '@/services/ids.service';

@Controller('/ids')
export default class IDsController {
  @Get('/me')
  public async getUserIDs(@UserDetails() userDetails: TokenClaims) {
    const userId = userDetails.sub;
    const ids = await idsService.getUserIDs(userId);
    return { ids };
  }

  // @Post('/')
  // public async verifyID(@UserDetails() userDetails: TokenClaims, @Body() idData: AddIDDto) {
  //   const userId = userDetails.sub;
  //   // Make Service to handle zoop

  // }
}
