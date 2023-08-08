import { VerifyOtpDTO } from '@/dtos/request/otp.dto';
import { residentialPeerService } from '@/services/residentialPeer.service';
import { Controller } from '@/utils/decorators/controller';
import { Post } from '@/utils/decorators/methods';
import { Body, Params } from '@/utils/decorators/request';

@Controller('/peer/residential')
export default class WorkExPeerController {
  @Post('/:peerUUID/send-otp')
  async peerSendOTP(@Params('peerUUID') peerUUID: string) {
    return await residentialPeerService.peerSendOTP(peerUUID);
  }

  @Post('/:peerUUID/verify-otp')
  async verifyPeerConatct(@Params('peerUUID') peerUUID: string, @Body() otp_data: VerifyOtpDTO) {
    const status = await residentialPeerService.verifyPeerConatct(peerUUID, otp_data.otp);
    return { success: status, message: 'Verified' };
  }
  
}
