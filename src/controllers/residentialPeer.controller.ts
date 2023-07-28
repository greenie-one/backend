import { VerifyOtpDTO } from '@/dtos/request/workExPeer.dto';
import { SendPeerOtpResponse, VerifyPeerResponse } from '@/dtos/response/residentialPeer.response';
import { residentialPeerService } from '@/services/residentialPeer.service';
import { Controller } from '@/utils/decorators/controller';
import { Post } from '@/utils/decorators/methods';
import { Body, Params } from '@/utils/decorators/request';

@Controller('/peer/residential')
export default class WorkExPeerController {
  @Post('/:peerUUID/send-otp')
  async peerSendOTP(@Params('peerUUID') peerUUID: string): Promise<SendPeerOtpResponse> {
    return residentialPeerService.peerSendOTP(peerUUID);
  }

  @Post('/:peerUUID/verify-otp')
  async verifyPeerContact(@Params('peerUUID') peerUUID: string, @Body() otp_data: VerifyOtpDTO): Promise<VerifyPeerResponse> {
    return residentialPeerService.verifyPeerContact(peerUUID, otp_data.otp);
  }
}
