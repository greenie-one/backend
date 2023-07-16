import { TokenClaims } from '@/dtos/auth.dto';
import { sharingDTO } from '@/dtos/sharing.dto';
import { sharingService } from '@/services/sharing.service';
import { UserDetails } from '@/utils/decorators/auth';
import { Controller } from '@/utils/decorators/controller';
import { Get, Post } from '@/utils/decorators/methods';
import { Body } from '@/utils/decorators/request';

@Controller('/share')
export default class sharingController {
  @Post('/create')
  async shareThing(@UserDetails() userDetails: TokenClaims, @Body() data: sharingDTO) {
    return sharingService.share(userDetails.sub, data);
  }

  @Get('/get')
  async getsharedThing(@UserDetails() userDetails: TokenClaims) {
    return sharingService.getShared(userDetails.sub);
  }
}
