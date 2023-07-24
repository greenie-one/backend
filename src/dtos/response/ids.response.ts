import { IDTypeEnum } from '../request/ids.dto';

export interface IDVerification {
  isVerified: boolean;
  lastUpdated: Date;
}

export interface SingleID {
  id: string;
  idType: IDTypeEnum;
  idNumber: string;
  user: string;
  address: Record<string, string>;
  location: string;
  verification: IDVerification;
  createdAt: Date;
  updatedAt: Date;
}

export type GetIDsResponse = SingleID[];

export interface AadharRequestOtpResponse {
  result?: {
    is_number_linked?: boolean;
    is_aadhaar_valid?: boolean;
  };
  request_id?: string;
  success?: boolean;
  response_code?: string;
  response_message?: string;
}

export interface AadharVerifyOtpResponse {
  result?: {
    user_aadhaar_number?: string;
    user_address?: {
      country?: string;
      dist?: string;
      state?: string;
      po?: string;
      loc?: string;
      vtc?: string;
      subdist?: string;
      street?: string;
      house?: string;
      landmark?: string;
    };
  };
  success?: boolean;
  response_code?: string;
  response_message?: string;
}

export interface PanVerifyResponse {
  success?: boolean;
  response_code?: string;
  response_message?: string;
  result?: {
    user_address?: {
      line1?: string;
      line2?: string;
      street_name?: string;
      city?: string;
      state?: string;
      country?: string;
      full?: string;
    };
  };
}

export interface DrivingLicenseVerifyResponse {
  success?: boolean;
  result?: {
    user_address?: [
      {
        addressLine1?: string;
        completeAddress?: string;
        country?: string;
        district?: string;
        pin?: string;
        state?: string;
        type?: string;
      },
    ];
  };
  response_code?: string;
  response_message?: string;
}
