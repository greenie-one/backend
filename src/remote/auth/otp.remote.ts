import { env } from '@/config';
import ejs from 'ejs';
import { HttpClient } from '../generic/httpClient';

const ACCOUNT_SID = env('TWILIO_ACCOUNT_SID');
const AUTH_TOKEN = env('TWILIO_AUTH_TOKEN');
const FROM_MOBILE = env('TWILIO_FROM_MOBILE');

export class AuthRemote {
  static async requestOtp(mobileNumber: string, otp: string) {
    const body = await ejs.renderFile('templates/otpTemplate.ejs', { otp });
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
}
