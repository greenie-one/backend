import { env } from '@/config';
import { HttpClient } from '../generic/httpClient';

export enum otpType {
  EMAIL = 'EMAIL',
  MOBILE = 'MOBILE',
}

type SendOtp = {
  contact: string;
  type: otpType;
  otp: string;
};

export class Otp {
  static async sendOtp(otp_data: SendOtp) {
    return HttpClient.callApi({
      url: `${env('REMOTE_BASE_URL')}/otp/send`,
      method: 'POST',
      body: otp_data,
    });
  }
}
