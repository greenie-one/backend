import { AddToWaitlistDto } from '@/dtos/waitlist.dto';
import { Mailer } from '@/remote/email/emailer';
import { HttpException } from '@exceptions/httpException';
import { Waitlist, WaitlistModel } from '@models/waitlist.model';

export class WaitlistService {
  private waitlistMailer = new Mailer();
  // For testing purposes
  public async getAllWaitlist(): Promise<Waitlist[]> {
    const waitlist = await WaitlistModel.find();
    return waitlist;
  }

  public async addEmailToWaitlist(waitlistData: AddToWaitlistDto): Promise<Waitlist> {
    const existingWaitlist = await WaitlistModel.findOne({ email: waitlistData.email });
    if (existingWaitlist) {
      throw new HttpException('Email already in waitlist', 400);
    }
    const waitlist = await WaitlistModel.create(waitlistData);

    this.waitlistMailer.sendMail({
      from: 'office@greenie.one',
      to: waitlistData.email,
      subject: 'Added to Greenie Waitlist!',
      text: "You've been added to the waitlist! We'll let you know when you can start using Greenie.",
    });
    return waitlist;
  }
}
