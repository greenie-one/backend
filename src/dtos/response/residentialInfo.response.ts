export interface AddResidentialInfoResponse {
  id: string;
  success: boolean;
}

export interface ResidentialInfoResponse {
  id: string;
  address_line_1: string;
  address_line_2: string;
  landmark: string;
  pincode: string;
  city: string;
  state: string;
  country: string;
  start_date: string;
  end_date: string;
}

export interface GetResidentialInfoResponse {
  residentialInfos: ResidentialInfoResponse[];
}

