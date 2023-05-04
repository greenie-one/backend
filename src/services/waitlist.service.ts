import { AddToWaitlistDto } from '@/dtos/waitlist.dto';
import { WaitlistMailer } from '@/remote/email/waitlist';
import { HttpException } from '@exceptions/httpException';
import { Waitlist, WaitlistModel } from '@models/waitlist.model';

export class WaitlistService {
  public async addEmailToWaitlist(waitlistData: AddToWaitlistDto): Promise<Waitlist> {
    const existingWaitlist = await WaitlistModel.findOne({ email: waitlistData.email });
    if (existingWaitlist) {
      throw new HttpException('Email already in waitlist', 400);
    }
    const waitlist = await WaitlistModel.create(waitlistData);

    WaitlistMailer.sendMail(waitlistData.name, waitlistData.email);
    return waitlist;
  }
}
