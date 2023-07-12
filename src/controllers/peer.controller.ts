import { TokenClaims } from '@/dtos/auth.dto';
import { CreatePeerDto, UpdateSkillVerificationDto } from '@/dtos/peer.dto';
import { peerService } from '@/services/peer.service';
import { UserDetails } from '@/utils/decorators/auth';
import { Controller } from '@/utils/decorators/controller';
import { Get, Patch, Post } from '@/utils/decorators/methods';
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

  @Patch('/:peerid/:skillid')
  async updateSkillVerification(
    @UserDetails() userDetails: TokenClaims,
    @Params('peerid') peerId: string,
    @Params('skillid') skillid: string,
    @Body() data: UpdateSkillVerificationDto,
  ) {
    return peerService.updateSkillVerification(userDetails.sub, peerId, skillid, data);
  }

  // @Patch('/:peerid/:documentid')
  // async updatedocumentVerification(
  //   @UserDetails() userDetails: TokenClaims,
  //   @Params('peerid') peerId: string,
  //   @Params('documentid') documentid: string,
  //   @Body() data: UpdateDocumentVerificationDto,
  // ) {
  //   return peerService.updateDocumentVerification(userDetails.sub, peerId, documentid, data);
  // }
}
