import { AddToWaitlistDto } from '@/dtos/waitlist.dto';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { WaitlistMailer } from '@/remote/waitlist/email';
import { HttpException } from '@exceptions/httpException';
import { Waitlist, WaitlistModel } from '@models/waitlist.model';

export class WaitlistService {
  public async addEmailToWaitlist(waitlistData: AddToWaitlistDto): Promise<Waitlist> {
    const existingWaitlist = await WaitlistModel.findOne({ email: waitlistData.email });
    if (existingWaitlist) {
      throw new HttpException(ErrorEnum.ALREADY_IN_WAITLIST);
    }
    const waitlist = await WaitlistModel.create(waitlistData);

    WaitlistMailer.sendWaitlistMail(waitlistData.name, waitlistData.email);
    return waitlist;
  }
}
