import { AddToWaitlistDto } from '@/dtos/request/waitlist.dto';
import { Controller } from '@/utils/decorators/controller';
import { Post } from '@/utils/decorators/methods';
import { Body } from '@/utils/decorators/request';
import { WaitlistService } from '@services/waitlist.service';

@Controller('/waitlist')
export default class WaitlistController {
  public waitlistService: WaitlistService = new WaitlistService();

  @Post('/')
  public async addToWaitlist(@Body() AddToWaitlist: AddToWaitlistDto) {
    const waitlistData: AddToWaitlistDto = AddToWaitlist;
    const waitlist = await this.waitlistService.addEmailToWaitlist(waitlistData);
    return { data: waitlist, message: 'added to waitlist' };
  }
}
