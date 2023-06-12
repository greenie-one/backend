import { TokenClaims } from '@/dtos/auth.dto';
import { AddIDDto } from '@/dtos/ids.dto';
import { idsService } from '@/services/ids.service';
import { UserDetails } from '@/utils/decorators/auth';
import { Controller } from '@/utils/decorators/controller';
import { Get, Post } from '@/utils/decorators/methods';
import { Body } from '@/utils/decorators/request';

@Controller('/ids')
export default class IDsController {
  @Get('/me')
  public async getUserIDs(@UserDetails() userDetails: TokenClaims) {
    const userId = userDetails.sub;
    const ids = await idsService.getUserIDs(userId);
    return { ids };
  }

  @Post('/verify')
  public async verifyID(@UserDetails() userDetails: TokenClaims, @Body() idData: AddIDDto) {
    const userId = userDetails.sub;
    const id = await idsService.verifyId(userId, idData);
    return id;
  }
}
