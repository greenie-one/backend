import { IDTypeEnum } from '../request/ids.dto';

export class NormalizedAddress {
  address_line_1: string;
  address_line_2: string;
  street: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  type: string;
}

export interface IDResponse {
  id: string;
  id_type: IDTypeEnum;
  id_number: string;
  user: string;
  address: NormalizedAddress;
  dob: string;
  additional_data: object;
  location: string;
  createdAt: Date;
  updatedAt: Date;
}
