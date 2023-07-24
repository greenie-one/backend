import { WorkVerificationBy } from '../request/peer.dto';
import { GetDocumentsResponse } from './document.response';
import { SkillResponse } from './skills.response';
import { WorkExperienceResponse } from './workExperience.response';

export interface CreateWorkPeerResponse {
  id: string;
  name: string;
}

export type DeleteWorkPeerResponse = Record<string, never>;

export type ResendPeerLinkResponse = Record<string, never>;

export type UpdateWorkPeerResponse = CreateWorkPeerResponse;

export type WorkPeerSendOtpResponse = Record<string, never>;

export type WorkPeerVerifyResponse = Record<string, never>;

export interface SingleWorkPeer {
  id: string;
  name: string;
  email: string;
  phone: string;
  workExperience: string;
  isVerificationCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export type GetUserWorkPeersResponse = SingleWorkPeer[];

export interface GetPeerWorkExDataResponse {
  name: string;
  profilePic: string;
  companyName?: string;
  peerPost?: string;
  designation?: string;
  optionalVerificationFields?: Partial<WorkExperienceResponse>;
  skills?: SkillResponse[];
  documents?: GetDocumentsResponse;
}

export interface GetPeerInformationResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  verificationBy: WorkVerificationBy;
  data: GetPeerWorkExDataResponse;
  dateOfJoining: Date;
  dateOfLeaving?: Date;
}
