import { CreateToWaitlistDto } from '@/dtos/request/waitlist.dto';
import { CreateWaitlistResponse } from '@/dtos/response/waitlist.response';
import { Controller } from '@/utils/decorators/controller';
import { Post } from '@/utils/decorators/methods';
import { Body } from '@/utils/decorators/request';
import { WaitlistService } from '@services/waitlist.service';

@Controller('/waitlist')
export default class WaitlistController {
  public waitlistService: WaitlistService = new WaitlistService();

  @Post('/')
  public async addToWaitlist(@Body() waitlistData: CreateToWaitlistDto): Promise<CreateWaitlistResponse> {
    return this.waitlistService.addEmailToWaitlist(waitlistData);
  }
}
