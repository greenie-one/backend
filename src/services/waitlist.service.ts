import { CreateToWaitlistDto } from '@/dtos/request/waitlist.dto';
import { CreateWaitlistResponse } from '@/dtos/response/waitlist.response';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { WaitlistMailer } from '@/remote/waitlist/email';
import { HttpException } from '@exceptions/httpException';
import { WaitlistModel } from '@models/waitlist.model';

export class WaitlistService {
  public async addEmailToWaitlist(waitlistData: CreateToWaitlistDto): Promise<CreateWaitlistResponse> {
    const existingWaitlist = await WaitlistModel.findOne({ email: waitlistData.email });
    if (existingWaitlist) {
      throw new HttpException(ErrorEnum.ALREADY_IN_WAITLIST);
    }
    const waitlist = await WaitlistModel.create(waitlistData);

    await WaitlistMailer.sendWaitlistMail(waitlistData.name, waitlistData.email);
    return {
      email: waitlist.email,
      name: waitlist.name,
      phoneNumber: waitlist.phone_number,
    };
  }
}
