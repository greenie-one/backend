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
    user_full_name:string, 
    user_dob:string,
    user_parent_name:string,
  };
  success?: boolean;
  response_code?: string;
  response_message?: string;
}

export interface AadharData{
  name:string,
  address:{},
  dob:string,
  aadharNumber:string,
  parentName:string,
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
    user_full_name:string,
    masked_aadhaar:string,
    pan_type:string,
    user_email:string,
    user_phone_number:string,
    user_gender:string,
    user_dob:string,
    aadhaar_linked_status:boolean
  };
}

export interface PanData{
  name:string,
  aadharLinked:boolean,
  panType:string,
  email:string,
  phoneNumber:string,
  gender:string,
  dob:string,
  aadharNumber:string,
}

export interface DrivingLicenseResponse {
  success?: boolean;
  result?: {
    user_full_name:string, 
    user_dob:string,
    dl_number:string,
    user_blood_group:string,
    father_or_husband:string,
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
    vehicle_category_details:[{
      cov:string,
    }]
  };
  response_code?: string;
  response_message?: string;
}

export interface DrivingLicenseData{
  name:string,
  address:[{}],
  bloodGroup :string,
  licenseNumber:string,
  DOB:string,
  FaterName:string,
  vehicleType:[{}]
}
