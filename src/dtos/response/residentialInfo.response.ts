export interface AddResidentialInfoResponse {
  id: string;
  success: boolean;
}

export interface SingleResidentialInfo {
  id: string;
  address_line_1: string;
  address_line_2: string;
  landmark: string;
  pincode: string;
  city: string;
  state: string;
  country: string;
  start_date?: Date;
  end_date?: Date;
}

export type GetResidentialInfoResponse = SingleResidentialInfo[];
export type CreateResidentialInfoResponse = SingleResidentialInfo;
export type UpdateResidentialInfoResponse = SingleResidentialInfo;

export type DeleteResidentialInfoResponse = Record<string, never>;
