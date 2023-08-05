import { IDTypeEnum } from '../request/ids.dto';

export interface SingleID {
  id: string;
  id_type: IDTypeEnum;
  id_number: string;
  user: string;
  address: NormalizedAddress;
  dob: string;
  fullName: string
  createdAt: Date;
  updatedAt: Date;
}

export type GetIDsResponse = SingleID[];

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
