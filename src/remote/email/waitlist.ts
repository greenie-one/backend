import ejs from 'ejs';
import { mailer } from '../generic/emailer';

export class WaitlistMailer {
  static async sendMail(firstName: string, email: string) {
    const text = await ejs.renderFile('templates/waitlist.ejs', { firstName });
    return mailer.sendMail({
      from: 'office@greenie.one',
      to: email,
      subject: 'Added to Greenie Waitlist!',
      text,
    });
  }
}
