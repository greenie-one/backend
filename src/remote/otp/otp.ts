import { env } from '@/config';
import { OtpType } from '@/dtos/request/otp.dto';
import { SendOtpResponse } from '../dtos/otp.response';
import { HttpClient } from '../generic/httpClient';

type SendOtp = {
  contact: string;
  type: OtpType;
};

export class Otp {
  static async sendOtp(otp_data: SendOtp): Promise<SendOtpResponse> {
    return HttpClient.callApi({
      url: `${env('REMOTE_BASE_URL')}/otp/send`,
      method: 'POST',
      body: otp_data,
    });
  }
}
