import { TokenClaims } from '@/dtos/auth.dto';
import { sharingDTO, sharingUpdateStateDTO } from '@/dtos/sharing.dto';
import { sharingService } from '@/services/sharing.service';
import { UserDetails } from '@/utils/decorators/auth';
import { Controller } from '@/utils/decorators/controller';
import { Get, Patch, Post } from '@/utils/decorators/methods';
import { Body, Params } from '@/utils/decorators/request';

@Controller('/share')
export default class sharingController {
  @Post('/')
  async shareThing(@UserDetails() userDetails: TokenClaims, @Body() data: sharingDTO) {
    return sharingService.share(userDetails.sub, data);
  }

  @Get('/sharedWith/:id')
  async getsharedThing(@Params('id') peerId: string) {
    return sharingService.getSharedWithData(peerId);
  }

  @Patch('/updateState/:id')
  async updateState(@Params('id') peerId: string, @Body() data: sharingUpdateStateDTO) {
    return sharingService.updateShared(peerId, data);
  }
}
