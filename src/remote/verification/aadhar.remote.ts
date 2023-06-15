import { env } from '@/config';
import { AadharRequestOtpResponse, AadharVerifyOtpResponse } from '@dtos/ids.dto';
import { HttpClient } from '../generic/httpClient';

export class AadhaarVerification {
  static async requestOtp(aadhaarNumber: string, taskId: string): Promise<AadharRequestOtpResponse> {
    return HttpClient.callApi({
      url: `https://test.zoop.one/in/identity/okyc/otp/request`,
      method: 'POST',
      headers: {
        'app-id': env('ZOOP_ID'),
        'api-key': env('ZOOP_KEY'),
        'org-id': '60800ca35ed0c7001cad2605',
        'Content-Type': 'application/json',
      },
      body: {
        data: {
          customer_aadhaar_number: aadhaarNumber,
          consent: 'Y',
          consent_text: 'I hereby declare my consent agreement for fetching my information via ZOOP API',
        },
        task_id: taskId,
      },
    });
  }

  static async verifyOtp(requestId: string, otp: string, taskId: string): Promise<AadharVerifyOtpResponse> {
    return HttpClient.callApi({
      url: `https://test.zoop.one/in/identity/okyc/otp/verify`,
      method: 'POST',
      headers: {
        'app-id': env('ZOOP_ID'),
        'api-key': env('ZOOP_KEY'),
        'Content-Type': 'application/json',
      },
      body: {
        data: {
          request_id: `${requestId}`,
          otp: `${otp}`,
          consent: 'Y',
          consent_text: 'I hear by declare my consent agreement for fetching my information via ZOOP API',
        },
        task_id: `${taskId}`,
      },
    });
  }
}
