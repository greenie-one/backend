import { CreatePeerDto, UpdatePeerWorkVerificationDto } from '@/dtos/peer.dto';
import { peerService } from '@/services/peer.service';
import { Controller } from '@/utils/decorators/controller';
import { Patch, Post } from '@/utils/decorators/methods';
import { Body, Params } from '@/utils/decorators/request';

@Controller('/peer')
export default class PeerController {
  @Post('/create')
  async createPeer(@Body() data: CreatePeerDto) {
    return peerService.createPeer(data);
  }

  @Patch('/work/:pid')
  async updatePeer(@Params('pid') peerId: string, @Body() data: UpdatePeerWorkVerificationDto) {
    return peerService.UpdatePeer(peerId, data);
  }

  // @Get('/get')
  // async getPeerVerification(@Params('id') peerId: string) {
  //   return peerService.getPeerVerification(userDetails.sub, peerId);
  // }
}
