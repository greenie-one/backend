export interface AadharVerifyResponse {
  request_id: string;
  task_id: string;
  group_id: string;
  success: boolean;
  response_code: string;
  response_message: string;
  result: AadharVerifyResult;
  metadata: Metadata;
  request_timestamp: string;
  response_timestamp: string;
}

export type AadharVerifyResult = {
  user_full_name: string;
  user_aadhaar_number: string;
  user_dob: string;
  user_gender: string;
  user_address: AadharUserAddress;
  address_zip: string;
  user_profile_image: string;
  user_has_image: boolean;
  aadhaar_xml_raw: string;
  user_zip_data: string;
  user_parent_name: string;
  aadhaar_share_code: string;
  user_mobile_verified: boolean;
  reference_id: string;
};

export interface AadharUserAddress {
  country: string;
  dist: string;
  state: string;
  po: string;
  loc: string;
  vtc: string;
  subdist: string;
  street: string;
  house: string;
  landmark: string;
}

export interface Metadata {
  billable: string;
}

export interface AadharRequestOtpResponse {
  request_id: string;
  task_id: string;
  group_id: string;
  success: boolean;
  response_code: string;
  response_message: string;
  result: ResultRequestOtp;
  metadata: Metadata;
  request_timestamp: string;
  response_timestamp: string;
}

export interface ResultRequestOtp {
  is_otp_sent: boolean;
  is_number_linked: boolean;
  is_aadhaar_valid: boolean;
}
