import { SingleResidentialInfo } from './residentialInfo.response';

export type SendPeerOtpResponse = Record<string, never>
export type VerifyPeerResponse = Record<string, never>

export interface GetResidentialPeerResponse {
  name: string;
  email: string;
  phone: string;
  verificationBy: string;
  user: {
    name: string;
    profilePic: string;
  };
  residentialInfo: SingleResidentialInfo;
}

export type DeleteResidentialPeerResponse = Record<string, never>

export interface CreateResidentialPeerResponse {
  link: string;
}

export interface GetUserPeersResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  verificationBy: string;
  ref: string;
  isVerificationCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
