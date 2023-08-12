import { env } from '@/config';
import { PanVerifyResponse } from '../dtos/pan.response';
import { HttpClient } from '../generic/httpClient';

export type Pan = {
  panNumber: string;
  taskId: string;
};

export class PanVerification {
  static async verifyPan(panNumber: string, taskId: string): Promise<PanVerifyResponse> {
    return HttpClient.callApi({
      url: `${env('REMOTE_BASE_URL')}/zoop/pan`,
      method: 'POST',
      headers: {
        'app-id': env('ZOOP_ID'),
        'api-key': env('ZOOP_KEY'),
        'Content-Type': 'application/json',
      },
      body: {
        panNumber,
        taskId,
      } as Pan,
    });
  }
}
