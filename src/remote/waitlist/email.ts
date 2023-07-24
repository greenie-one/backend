import { HttpClient } from '../generic/httpClient';
import { env } from '@/config';

export class WaitlistMailer {
  static async sendWaitlistMail(firstName: string, email: string) {
    return HttpClient.callApi({
      url: `${env('REMOTE_BASE_URL')}/waitlist/send`,
      method: 'POST',
      body: {
        name: firstName,
        email,
      },
    });
  }
}
