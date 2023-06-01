import ejs from 'ejs';
import { mailer } from '../generic/emailer';

export class WaitlistMailer {
  static async sendMail(firstName: string, email: string) {
    const html = await ejs.renderFile('templates/email/waitlist.ejs', { firstName });
    return mailer.sendMail({
      to: email,
      subject: 'Added to Greenie Waitlist!',
      html,
    });
  }
}
