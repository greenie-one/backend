import { env } from '@/config';
import { DrivingLicenseVerifyResponse } from '../dtos/driving.response';
import { HttpClient } from '../generic/httpClient';

export type DrivingLicense = {
  dlNumber: string;
  dob: string;
  taskId: string;
};

export class drivinLicenseVerification {
  static async verifyDrivingLicense(dlNumber: string, dob: string, taskId: string): Promise<DrivingLicenseVerifyResponse> {
    return HttpClient.callApi({
      url: `${env('REMOTE_BASE_URL')}/zoop/driving-license`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        dlNumber,
        dob,
        taskId,
      } as DrivingLicense,
    });
  }
}
