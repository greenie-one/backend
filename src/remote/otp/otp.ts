import { env } from '@/config';
import { OtpType } from '@/dtos/request/peer.dto';
import { HttpClient } from '../generic/httpClient';

type SendOtp = {
  contact: string;
  type: OtpType;
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
