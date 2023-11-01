import { env } from '@/config';
import { HttpClient } from '../generic/httpClient';

export class WorkVerification {
  static async sendPeerVerificationLinks(
    email: string,
    phone: string,
    verifierName: string,
    userName: string,
    companyName: string,
    mobileVerificationLink: string,
    emailVerificationLink: string,
  ) {
    console.info(`Sending links to ${verifierName} with email ${email} and phone ${phone}`);
    return HttpClient.callApi({
      url: `${env('REMOTE_BASE_URL')}/work/verification/send`,
      method: 'POST',
      body: {
        email,
        phone,
        verifierName,
        userName,
        companyName,
        mobileVerificationLink,
        emailVerificationLink,
      },
    });
  }
}

export class LocationVerfication {
  static async sendPeerVerificationLinks(
    email: string,
    phone: string,
    verifierName: string,
    userName: string,
    mobileVerificationLink: string,
    emailVerificationLink: string,
  ) {
    console.info(`Sending links to ${verifierName} with email ${email} and phone ${phone}`);
    return HttpClient.callApi({
      url: `${env('REMOTE_BASE_URL')}/location/verification/send`,
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
