import { TokenClaims } from '@/dtos/request/auth.dto';
import { SendPeerOtpDTO, VerifyOtpDTO } from '@/dtos/request/otp.dto';
import { CreateWorkPeerDto, UpdatePeerWorkVerificationDto } from '@/dtos/request/peer.dto';
import { peerService } from '@/services/peer.service';
import { UserDetails } from '@/utils/decorators/auth';
import { Controller } from '@/utils/decorators/controller';
import { Delete, Get, Patch, Post } from '@/utils/decorators/methods';
import { Body, Params, Reply } from '@/utils/decorators/request';
import { FastifyReply } from 'fastify';

@Controller('/peer')
export default class PeerController {
  @Get('/work/me')
  async getMyPeers(@UserDetails() userDetails: TokenClaims) {
    return peerService.getUserWorkPeers(userDetails.sub);
  }

  @Post('/work')
  async createWorkPeer(@UserDetails() userDetails: TokenClaims, @Body() data: CreateWorkPeerDto) {
    return peerService.createWorkPeer(userDetails.sub, data);
  }

  @Delete('/work/:peerId')
  async deletePeer(@Params('peerId') peerId: string) {
    return peerService.deletePeer(peerId);
  }

  @Get('/work/:id/resend')
  async resendLinksToPeers(@UserDetails() userDetails: TokenClaims, @Params('id') peerId: string) {
    return peerService.resendLinksToPeers(userDetails.sub, peerId);
  }

  @Patch('/work/:peerUUID')
  async updatePeer(@Params('peerUUID') peerUUID: string, @Body() data: UpdatePeerWorkVerificationDto) {
    return peerService.UpdatePeerWorkVerification(peerUUID, data);
  }

  @Get('/work/:peerUUID')
  async getPeerInformation(@Params('peerUUID') peerUUID: string, @Reply() reply: FastifyReply) {
    return peerService.getPeerInformation(peerUUID, reply);
  }

  @Post('/work/:peerUUID/send-otp')
  async peerSendOTP(@Params('peerUUID') peerUUID: string, @Body() otp_data: SendPeerOtpDTO) {
    return await peerService.peerSendOTP(peerUUID, otp_data.otpType);
  }

  @Post('/work/:peerUUID/verify-otp')
  async verifyPeerConatct(@Params('peerUUID') peerUUID: string, @Body() otp_data: VerifyOtpDTO) {
    const status = await peerService.verifyPeerConatct(peerUUID, otp_data.otpType, otp_data.otp);
    return { success: status, message: 'Verified' };
  }
}

