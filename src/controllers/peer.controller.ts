import { TokenClaims } from '@/dtos/auth.dto';
import { CreateWorkPeerDto, UpdatePeerWorkVerificationDto } from '@/dtos/peer.dto';
import { peerService } from '@/services/peer.service';
import { UserDetails } from '@/utils/decorators/auth';
import { Controller } from '@/utils/decorators/controller';
import { Get, Patch, Post } from '@/utils/decorators/methods';
import { Body, Params } from '@/utils/decorators/request';

@Controller('/peer')
export default class PeerController {
  @Post('/work')
  async createWorkPeer(@UserDetails() userDetails: TokenClaims, @Body() data: CreateWorkPeerDto) {
    return peerService.createWorkPeer(userDetails.sub, data);
  }

  @Post('/work/:id/resend')
  async resendLinksToPeers(@UserDetails() userDetails: TokenClaims, @Params('id') peerId: string) {
    return peerService.resendLinksToPeers(userDetails.sub, peerId);
  }

  @Patch('/work/:id')
  async updatePeer(@Params('id') peerId: string, @Body() data: UpdatePeerWorkVerificationDto) {
    return peerService.UpdatePeerWorkVerification(peerId, data);
  }

  @Get('/work/:peer_uuid')
  async getPeerVerification(@Params('peer_uuid') peer_uuid: string) {
    return peerService.getPeerInformation(peer_uuid);
  }
}
