import { TokenClaims } from '@/dtos/request/auth.dto';
import { VerifyOtpDTO } from '@/dtos/request/otp.dto';
import { CreateWorkPeerDto, UpdatePeerWorkVerificationDto } from '@/dtos/request/workExPeer.dto';
import { workPeerService } from '@/services/workExPeer.service';
import { UserDetails } from '@/utils/decorators/auth';
import { Controller } from '@/utils/decorators/controller';
import { Delete, Get, Patch, Post } from '@/utils/decorators/methods';
import { Body, Params, Reply } from '@/utils/decorators/request';
import { FastifyReply } from 'fastify';

@Controller('/peer')
export default class WorkExPeerController {
  @Get('/work/me')
  async getMyPeers(@UserDetails() userDetails: TokenClaims) {
    return workPeerService.getUserWorkPeers(userDetails.sub);
  }

  @Post('/work')
  async createWorkPeer(@UserDetails() userDetails: TokenClaims, @Body() data: CreateWorkPeerDto) {
    return workPeerService.createWorkPeer(userDetails.sub, data);
  }

  @Delete('/work/:peerId')
  async deletePeer(@UserDetails() userDetails: TokenClaims, @Params('peerId') peerId: string) {
    return workPeerService.deletePeer(userDetails.sub, peerId);
  }

  @Get('/work/:id/resend')
  async resendLinksToPeers(@UserDetails() userDetails: TokenClaims, @Params('id') peerId: string) {
    return workPeerService.resendLinksToPeers(userDetails.sub, peerId);
  }

  @Patch('/work/:peerUUID')
  async updatePeer(@Params('peerUUID') peerUUID: string, @Body() data: UpdatePeerWorkVerificationDto) {
    return workPeerService.updatePeerWorkVerification(peerUUID, data);
  }

  @Get('/work/:peerUUID')
  async getPeerInformation(@Params('peerUUID') peerUUID: string, @Reply() reply: FastifyReply) {
    return workPeerService.getPeerInformation(peerUUID, reply);
  }

  @Post('/work/:peerUUID/send-otp')
  async peerSendOTP(@Params('peerUUID') peerUUID: string) {
    return workPeerService.peerSendOTP(peerUUID);
  }

  @Post('/work/:peerUUID/verify-otp')
  async verifyPeerConatct(@Params('peerUUID') peerUUID: string, @Body() otp_data: VerifyOtpDTO) {
    return workPeerService.verifyPeerContact(peerUUID, otp_data.otp, otp_data.otpType);
  }
}
