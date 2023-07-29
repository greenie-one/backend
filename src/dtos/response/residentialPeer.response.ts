export interface GetResidentialPeerResponse {
  name: string;
  email: string;
  phone: string;
  verificationBy: string;
  user: {
    name: string;
    profilePic: string;
  };
}

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
