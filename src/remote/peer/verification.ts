import { env } from '@/config';
import { HttpClient } from '../generic/httpClient';

export class verification {
  static async GetPeerVerification(email: string, phone: string, verifierName: string, userName: string, verificationLink: string) {
    return HttpClient.callApi({
      url: `${env('REMOTE_BASE_URL')}/remote/verification/send`,
      method: 'POST',
      body: {
        email,
        phone,
        verifierName,
        userName,
        verificationLink,
      },
    });
  }
}
