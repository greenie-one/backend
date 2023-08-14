import { TokenClaims } from '@/dtos/request/auth.dto';
import { VerifyOtpDTO } from '@/dtos/request/otp.dto';
import { CreateResidentialPeerDto } from '@/dtos/request/residentialPeer.dto';
import { CreateResidentialPeerResponse, GetResidentialPeerResponse, GetUserPeersResponse } from '@/dtos/response/residentialPeer.response';
import { residentialPeerService } from '@/services/residentialPeer.service';
import { UserDetails } from '@/utils/decorators/auth';
import { Controller } from '@/utils/decorators/controller';
import { Delete, Get, Post } from '@/utils/decorators/methods';
import { Body, Params, Reply } from '@/utils/decorators/request';
import { FastifyReply } from 'fastify';

@Controller('/peer/residential')
export default class ResidentialPeerController {
  @Get('/:peerUUID/send-otp')
  async peerSendOTP(@Params('peerUUID') peerUUID: string) {
    return residentialPeerService.peerSendOTP(peerUUID);
  }

  @Post('/:peerUUID/verify-otp')
  async verifyPeerConatct(@Params('peerUUID') peerUUID: string, @Body() otp_data: VerifyOtpDTO) {
    return residentialPeerService.verifyPeerConatct(peerUUID, otp_data.otp, otp_data.otpType);
  }

  @Get('/:peerUUID')
  async getPeerInformation(@Params('peerUUID') peerUUID: string, @Reply() reply: FastifyReply): Promise<GetResidentialPeerResponse> {
    return residentialPeerService.getPeer(peerUUID, reply);
  }

  @Get('/me')
  async getUserPeers(@UserDetails() userDetails: TokenClaims): Promise<GetUserPeersResponse[]> {
    return residentialPeerService.getUserPeers(userDetails.sub);
  }

  @Post('')
  async createResidentialPeer(
    @UserDetails() userDetails: TokenClaims,
    @Body() data: CreateResidentialPeerDto,
  ): Promise<CreateResidentialPeerResponse> {
    return residentialPeerService.createPeer(userDetails.sub, data);
  }

  @Delete('/:peerId')
  async deleteResidentialPeer(@UserDetails() userDetails: TokenClaims, @Params('peerId') peerId: string) {
    return residentialPeerService.deletePeer(userDetails.sub, peerId);
  }
  
}
