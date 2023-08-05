import { WorkVerificationBy } from '../request/workExPeer.dto';
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
  peerPost: string;
  isVerificationCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type GetUserWorkPeersResponse = SingleWorkPeer[];

export interface GetPeerWorkExDataResponse {
  name: string;
  profilePic: string;
  companyName: string;
  peerPost: string;
  designation: string;
  selectedFields?: Partial<WorkExperienceResponse>;
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
