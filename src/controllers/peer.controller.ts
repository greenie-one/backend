import { TokenClaims } from '@/dtos/auth.dto';
import { CreateWorkPeerDto, UpdatePeerWorkVerificationDto } from '@/dtos/peer.dto';
import { peerService } from '@/services/peer.service';
import { UserDetails } from '@/utils/decorators/auth';
import { Controller } from '@/utils/decorators/controller';
import { Get, Patch, Post } from '@/utils/decorators/methods';
import { Body, Params } from '@/utils/decorators/request';

@Controller('/peer')
export default class PeerController {
  @Post('work/create')
  async createWorkPeer(@UserDetails() userDetails: TokenClaims, @Body() data: CreateWorkPeerDto) {
    return peerService.createWorkPeer(userDetails.sub, data);
  }

  @Patch('/work/:pid')
  async updatePeer(@Params('pid') peerId: string, @Body() data: UpdatePeerWorkVerificationDto) {
    return peerService.UpdatePeerWorkVerification(peerId, data);
  }

  @Get('/get/:pid')
  async getPeerVerification(@Params('id') peerId: string) {
    return peerService.getPeerInformation(peerId);
  }
}
