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
