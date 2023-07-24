import { TokenClaims } from '@/dtos/request/auth.dto';
import {
  CreateWorkPeerDto,
  SendPeerOtpDTO as SendWorkPeerOtpDTO,
  UpdatePeerWorkVerificationDto,
  VerifyOtpDTO as VerifyWorkPeerOtpDTO,
} from '@/dtos/request/peer.dto';
import {
  CreateWorkPeerResponse,
  DeleteWorkPeerResponse,
  GetPeerInformationResponse,
  GetUserWorkPeersResponse,
  ResendPeerLinkResponse,
  UpdateWorkPeerResponse,
  WorkPeerSendOtpResponse,
  WorkPeerVerifyResponse,
} from '@/dtos/response/peer.response';
import { peerService } from '@/services/peer.service';
import { UserDetails } from '@/utils/decorators/auth';
import { Controller } from '@/utils/decorators/controller';
import { Delete, Get, Patch, Post } from '@/utils/decorators/methods';
import { Body, Params, Reply } from '@/utils/decorators/request';
import { FastifyReply } from 'fastify';

@Controller('/peer')
export default class PeerController {
  @Get('/work/me')
  async getMyPeers(@UserDetails() userDetails: TokenClaims): Promise<GetUserWorkPeersResponse> {
    return peerService.getUserWorkPeers(userDetails.sub);
  }

  @Post('/work')
  async createWorkPeer(@UserDetails() userDetails: TokenClaims, @Body() data: CreateWorkPeerDto): Promise<CreateWorkPeerResponse> {
    return peerService.createWorkPeer(userDetails.sub, data);
  }

  @Delete('/work/:peerId')
  async deletePeer(@UserDetails() userDetails: TokenClaims, @Params('peerId') peerId: string): Promise<DeleteWorkPeerResponse> {
    return peerService.deletePeer(userDetails.sub, peerId);
  }

  @Get('/work/:id/resend')
  async resendLinksToPeers(@UserDetails() userDetails: TokenClaims, @Params('id') peerId: string): Promise<ResendPeerLinkResponse> {
    return peerService.resendLinksToPeers(userDetails.sub, peerId);
  }

  @Patch('/work/:peerUUID')
  async updatePeer(@Params('peerUUID') peerUUID: string, @Body() data: UpdatePeerWorkVerificationDto): Promise<UpdateWorkPeerResponse> {
    return peerService.updatePeerWorkVerification(peerUUID, data);
  }

  @Get('/work/:peerUUID')
  async getPeerInformation(@Params('peerUUID') peerUUID: string, @Reply() reply: FastifyReply): Promise<GetPeerInformationResponse> {
    return peerService.getPeerInformation(peerUUID, reply);
  }

  @Post('/work/:peerUUID/send-otp')
  async peerSendOTP(@Params('peerUUID') peerUUID: string, @Body() otp_data: SendWorkPeerOtpDTO): Promise<WorkPeerSendOtpResponse> {
    return await peerService.peerSendOTP(peerUUID, otp_data.otpType);
  }

  @Post('/work/:peerUUID/verify-otp')
  async verifyPeerContact(@Params('peerUUID') peerUUID: string, @Body() otp_data: VerifyWorkPeerOtpDTO): Promise<WorkPeerVerifyResponse> {
    return peerService.verifyPeerConatct(peerUUID, otp_data.otpType, otp_data.otp);
  }
}
