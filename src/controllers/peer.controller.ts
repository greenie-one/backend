import { TokenClaims } from '@/dtos/auth.dto';
import { SendPeerOtpDTO, VerifyOtpDTO } from '@/dtos/otp.dto';
import { CreateWorkPeerDto, UpdatePeerWorkVerificationDto } from '@/dtos/peer.dto';
import { peerService } from '@/services/peer.service';
import { UserDetails } from '@/utils/decorators/auth';
import { Controller } from '@/utils/decorators/controller';
import { Delete, Get, Patch, Post } from '@/utils/decorators/methods';
import { Body, Params } from '@/utils/decorators/request';

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

  @Get('/work/:id/resend')
  async resendLinksToPeers(@UserDetails() userDetails: TokenClaims, @Params('id') peerId: string) {
    return peerService.resendLinksToPeers(userDetails.sub, peerId);
  }

  @Patch('/work/:peerUUID')
  async updatePeer(@Params('peerUUID') peerUUID: string, @Body() data: UpdatePeerWorkVerificationDto) {
    return peerService.UpdatePeerWorkVerification(peerUUID, data);
  }

  @Get('/work/:peerUUID')
  async getPeerInformation(@Params('peerUUID') peerUUID: string) {
    return peerService.getPeerInformation(peerUUID);
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

  @Delete('/work/:peerUUID')
  async deletePeer(@Params('peerUUID') peerUUID: string) {
    return peerService.deletePeer(peerUUID);
  }
}
