import { env } from '@/config';
import { AadharRequestOtpResponse, AadharVerifyResponse } from '../dtos/aadhar.response';
import { HttpClient } from '../generic/httpClient';

export type AadharOtp = {
  aadharNumber: string;
  taskId: string;
};

export type AadharVerify = {
  requestId: string;
  otp: string;
  taskId: string;
};

export class AadhaarVerification {
  static async requestOtp(aadhaarNumber: string, taskId: string): Promise<AadharRequestOtpResponse> {
    return HttpClient.callApi({
      url: `${env('REMOTE_BASE_URL')}/aadhar/otp`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        aadharNumber: aadhaarNumber,
        taskId,
      } as AadharOtp,
    });
  }

  static async verifyOtp(requestId: string, otp: string, taskId: string): Promise<AadharVerifyResponse> {
    return HttpClient.callApi({
      url: `${env('REMOTE_BASE_URL')}/zoop/aadhar/verify`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        requestId,
        otp,
        taskId,
      } as AadharVerify,
    });
  }
}
