import { TokenClaims } from '@/dtos/auth.dto';
import { CreatePeerDto } from '@/dtos/peer.dto';
import { peerService } from '@/services/peer.service';
import { UserDetails } from '@/utils/decorators/auth';
import { Controller } from '@/utils/decorators/controller';
import { Get, Post } from '@/utils/decorators/methods';
import { Body, Params } from '@/utils/decorators/request';

@Controller('/peer')
export default class PeerController {
  @Post('/create')
  async createPeer(@UserDetails() userDetails: TokenClaims, @Body() data: CreatePeerDto) {
    return peerService.createPeer(userDetails.sub, data);
  }

  @Get('/:id')
  async getPeerVerification(@UserDetails() userDetails: TokenClaims, @Params('id') peerId: string) {
    return peerService.getPeerVerification(userDetails.sub, peerId);
  }
}
