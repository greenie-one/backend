import { HttpClient } from '../generic/httpClient';
import { env } from '@/config';

export class verification {
  static async GetPeerVerification(
    email: string,
    phone: string,
    verifierName: string,
    userName: string,
    mobileVerificationLink: string,
    emailVerificationLink: string,
  ) {
    console.info(`Sending links to ${verifierName} with email ${email} and phone ${phone}`);
    return HttpClient.callApi({
      url: `${env('REMOTE_BASE_URL')}/verification/send`,
      method: 'POST',
      body: {
        email,
        phone,
        verifierName,
        userName,
        mobileVerificationLink,
        emailVerificationLink,
      },
    });
  }
}
