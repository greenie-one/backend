export interface PanVerifyResponse {
  request_id: string;
  task_id: string;
  group_id: string;
  success: boolean;
  response_code: string;
  response_message: string;
  metadata: Metadata;
  result: PanResult;
  request_timestamp: string;
  response_timestamp: string;
}

export interface Metadata {
  billable: string;
}

export type PanResult = {
  pan_number: string;
  user_full_name: string;
  user_full_name_split: string[];
  masked_aadhaar: string;
  user_address: PanUserAddress;
  user_email: string;
  user_phone_number: string;
  user_gender: string;
  user_dob: string;
  aadhaar_linked_status: boolean;
  pan_type: string;
};

export interface PanUserAddress {
  line_1: string;
  line_2: string;
  street_name: string;
  zip: string;
  city: string;
  state: string;
  country: string;
  full: string;
}
