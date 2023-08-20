export interface DrivingLicenseVerifyResponse {
  request_id: string;
  task_id: string;
  group_id: string;
  success: boolean;
  response_code: string;
  response_message: string;
  metadata: Metadata;
  result: DLResult;
  request_timestamp: string;
  response_timestamp: string;
}

export interface Metadata {
  billable: string;
}

export type DLResult = {
  user_address: DLUserAddress[];
  user_blood_group: string;
  dl_number: string;
  user_dob: string;
  endorse_date: string;
  endorse_number: string;
  expiry_date: string;
  father_or_husband: string;
  issued_date: string;
  non_transport_validity: NonTransportValidity;
  state: string;
  status: string;
  status_details: StatusDetails;
  transport_validity: TransportValidity;
  user_full_name: string;
  user_image: string;
  vehicle_category_details: VehicleCategoryDetail[];
};

export interface DLUserAddress {
  addressLine1: string;
  completeAddress: string;
  country: string;
  district: string;
  pin: string;
  state: string;
  type: string;
}

export interface NonTransportValidity {
  from: string;
  to: string;
}

export interface StatusDetails {
  from: string;
  remarks: string;
  to: string;
}

export interface TransportValidity {
  from: string;
  to: string;
}

export interface VehicleCategoryDetail {
  cov: string;
  expiryDate: string;
  issueDate: string;
}
