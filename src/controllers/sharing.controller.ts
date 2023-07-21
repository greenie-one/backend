import { TokenClaims } from '@/dtos/auth.dto';
import { sharingDTO, updateSharingPeerStatesList } from '@/dtos/sharing.dto';
import { sharingService } from '@/services/sharing.service';
import { UserDetails } from '@/utils/decorators/auth';
import { Controller } from '@/utils/decorators/controller';
import { Get, Patch, Post } from '@/utils/decorators/methods';
import { Body, Params } from '@/utils/decorators/request';

@Controller('/share')
export default class SharingController {
  @Post('')
  async shareThing(@UserDetails() userDetails: TokenClaims, @Body() data: sharingDTO) {
    return sharingService.share(userDetails.sub, data);
  }

  @Get('/sharedWith/peer/:id')
  async getsharedThing(@Params('id') peerId: string) {
    return sharingService.getSharedWithPeerData(peerId);
  }

  @Patch('/sharedWith/peer/:id')
  async updateState(@Params('id') peerId: string, @Body() data: updateSharingPeerStatesList) {
    return sharingService.updateShared(peerId, data);
  }
}
