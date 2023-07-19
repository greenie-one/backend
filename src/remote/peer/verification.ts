import { env } from '@/config';
import { HttpClient } from '../generic/httpClient';

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
      url: `${env('REMOTE_BASE_URL')}/remote/verification/send`,
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
