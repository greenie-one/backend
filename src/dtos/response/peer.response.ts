import { WorkVerificationBy } from '../request/peer.dto';
import { GetDocumentResponse } from './document.response';
import { SkillResponse } from './skills.response';
import { WorkExperienceResponse } from './workExperience.response';

export interface CreateWorkPeerResponse {
  id: string;
  name: string;
}

export interface GetUserWorkPeerResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  workExperience: string;
  isVerificationCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetPeerWorkExDataResponse {
  name: string;
  profilePic: string;
  companyName?: string;
  peerPost?: string;
  designation?: string;
  selectedFields?: Partial<WorkExperienceResponse>;
  skills?: SkillResponse[];
  documents?: GetDocumentResponse[];
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
  dateOfJoining: string;
  dateOfLeaving?: string;
}
