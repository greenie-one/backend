import { AadharUserAddress, AadharVerifyResult } from '@/remote/dtos/aadhar.response';
import { DLResult, DLUserAddress } from '@/remote/dtos/driving.response';
import { PanResult, PanUserAddress } from '@/remote/dtos/pan.response';
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
  id_type: IDTypeEnum;
  id_number: string;
  data: AadharVerifyResult | DLResult | PanResult;
  address: AadharUserAddress | PanUserAddress | DLUserAddress;
  normalizedAddress: NormalizedAddress;
}
