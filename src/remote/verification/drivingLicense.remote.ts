import { env } from '@/config';
import { DrivingLicenseResponse } from '@/dtos/ids.dto';
import { HttpClient } from '../generic/httpClient';

export class drivinLicenseVerification {
  static async verifyDrivingLicense(dlNumber: string, dob: string, taskId: string): Promise<DrivingLicenseResponse> {
    return HttpClient.callApi({
      url: `https://test.zoop.one/api/v1/in/identity/dl/advance`,
      method: 'POST',
      headers: {
        auth: 'false',
        'app-id': env('ZOOP_ID'),
        'api-key': env('ZOOP_KEY'),
        'Content-Type': 'application/json',
      },
      body: {
        mode: 'sync',
        data: {
          customer_dl_number: dlNumber,
          customer_dob: dob,
          consent: 'Y',
          consent_text: 'I hereby declare my consent agreement for fetching my information via ZOOP API',
        },
        task_id: taskId,
      },
    });
  }
}
