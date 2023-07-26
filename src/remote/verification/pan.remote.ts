import { env } from '@/config';
import { PanVerifyResponse } from '@/dtos/response/ids.response';
import { HttpClient } from '../generic/httpClient';

export class PanVerification {
  static async verifyPan(panNumber: string, taskId: string): Promise<PanVerifyResponse> {
    return HttpClient.callApi({
      url: 'https://test.zoop.one/api/v1/in/identity/pan/pro',
      method: 'POST',
      headers: {
        'app-id': env('ZOOP_ID'),
        'api-key': env('ZOOP_KEY'),
        'Content-Type': 'application/json',
      },
      body: {
        mode: 'sync',
        data: {
          customer_pan_number: panNumber,
          consent: 'Y',
          consent_text: 'I hereby declare my consent agreement for fetching my information via ZOOP API',
        },
        task_id: taskId,
      },
    });
  }
}
