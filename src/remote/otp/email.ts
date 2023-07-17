import { env } from '@/config';
import { HttpClient } from '../generic/httpClient';

enum otpType {
  EMAIL = 'EMAIL',
  MOBILE = 'MOBILE',
}

export type SendOtp = {
  contact: string;
  type: otpType;
  otp: string;
};

export class EmailOtp {
  static async sendOtp(email: string, otp: string) {
    return HttpClient.callApi({
      url: `${env('REMOTE_BASE_URL')}/otp/send`,
      method: 'POST',
      body: {
        contact: email,
        type: otpType.EMAIL,
        otp,
      } as SendOtp,
    });
  }
}
