import { env } from '@/config';
import { HttpClient } from '../generic/httpClient';

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
