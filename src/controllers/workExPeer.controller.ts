import { TokenClaims } from '@/dtos/request/auth.dto';
import { CreateWorkPeerDto, UpdatePeerWorkVerificationDto, VerifyOtpDTO } from '@/dtos/request/workExPeer.dto';
import { CreateWorkPeerResponse, DeleteWorkPeerResponse, GetPeerInformationResponse, GetUserWorkPeersResponse, ResendPeerLinkResponse, UpdateWorkPeerResponse, WorkPeerSendOtpResponse, WorkPeerVerifyResponse } from '@/dtos/response/workExPeer.response';
import { workPeerService } from '@/services/workExPeer.service';
import { UserDetails } from '@/utils/decorators/auth';
import { Controller } from '@/utils/decorators/controller';
import { Delete, Get, Patch, Post } from '@/utils/decorators/methods';
import { Body, Params, Reply } from '@/utils/decorators/request';
import { FastifyReply } from 'fastify';

@Controller('/peer')
export default class WorkExPeerController {
  @Get('/work/me')
  async getMyPeers(@UserDetails() userDetails: TokenClaims): Promise<GetUserWorkPeersResponse> {
    return workPeerService.getUserWorkPeers(userDetails.sub);
  }

  @Post('/work')
  async createWorkPeer(@UserDetails() userDetails: TokenClaims, @Body() data: CreateWorkPeerDto): Promise<CreateWorkPeerResponse> {
    return workPeerService.createWorkPeer(userDetails.sub, data);
  }

  @Delete('/work/:peerId')
  async deletePeer(@UserDetails() userDetails: TokenClaims, @Params('peerId') peerId: string): Promise<DeleteWorkPeerResponse> {
    return workPeerService.deletePeer(userDetails.sub, peerId);
  }

  @Get('/work/:id/resend')
  async resendLinksToPeers(@UserDetails() userDetails: TokenClaims, @Params('id') peerId: string): Promise<ResendPeerLinkResponse> {
    return workPeerService.resendLinksToPeers(userDetails.sub, peerId);
  }

  @Patch('/work/:peerUUID')
  async updatePeer(@Params('peerUUID') peerUUID: string, @Body() data: UpdatePeerWorkVerificationDto): Promise<UpdateWorkPeerResponse> {
    return workPeerService.updatePeerWorkVerification(peerUUID, data);
  }

  @Get('/work/:peerUUID')
  async getPeerInformation(@Params('peerUUID') peerUUID: string, @Reply() reply: FastifyReply): Promise<GetPeerInformationResponse> {
    return workPeerService.getPeerInformation(peerUUID, reply);
  }

  @Get('/work/:peerUUID/send-otp')
  async peerSendOTP(@Params('peerUUID') peerUUID: string): Promise<WorkPeerSendOtpResponse> {
    return workPeerService.peerSendOTP(peerUUID);
  }

  @Post('/work/:peerUUID/verify-otp')
  async verifyPeerConatct(@Params('peerUUID') peerUUID: string, @Body() otp_data: VerifyOtpDTO): Promise<WorkPeerVerifyResponse> {
    return workPeerService.verifyPeerContact(peerUUID, otp_data.otp, otp_data.otpType);
  }
}
