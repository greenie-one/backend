import { env } from '@/config';
import ejs from 'ejs';
import { mailer } from '../generic/emailer';
import { HttpClient } from '../generic/httpClient';

const ACCOUNT_SID = env('TWILIO_ACCOUNT_SID');
const AUTH_TOKEN = env('TWILIO_AUTH_TOKEN');
const FROM_MOBILE = env('TWILIO_FROM_MOBILE');

export class AuthRemote {
  static async requestOtpMobile(mobileNumber: string, otp: string) {
    const body = await ejs.renderFile('templates/sms/otpTemplate.ejs', { otp });
    await HttpClient.callApi({
      url: `https://api.twilio.com/2010-04-01/Accounts/${ACCOUNT_SID}/Messages.json`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${ACCOUNT_SID}:${AUTH_TOKEN}`).toString('base64')}`,
      },
      body: {
        To: mobileNumber,
        From: FROM_MOBILE,
        Body: body,
      },
    });
    return true;
  }

  static async requestOtpEmail(email: string, otp: string) {
    const html = await ejs.renderFile('templates/email/otpTemplate.ejs', { otp });
    return mailer.sendMail({
      to: email,
      subject: 'Greenie login',
      html,
    });
    return true;
  }
}
