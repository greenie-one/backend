import { AllQuestions, DocumentVerification, HRQuestions, SelectedFields, SkillsVerification } from '@/models/workExPeer.model';
import { WorkExperience } from '@/models/workExperience.model';
import { Ref } from '@typegoose/typegoose';
import { WorkVerificationBy } from '../request/workExPeer.dto';
import { GetResidentialInfoResponse } from './residentialInfo.response';
import { GetUserPeersResponse } from './residentialPeer.response';
import { GetWorkExperienceResponse } from './workExperience.response';

export interface WorkPeerReportResponse {
  ref: Ref<WorkExperience, string>;
  name: string;
  email: string;
  phone: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  verificationBy: WorkVerificationBy;
  selectedFields?: SelectedFields;
  allQuestions?: AllQuestions;
  otherQuestions: HRQuestions;
  skills: SkillsVerification[];
  documents: DocumentVerification[];
  createdAt?: Date;
  updatedAt?: Date;
  isVerificationCompleted?: boolean;
}

// --------------------- Final DTOS ---------------------

export interface WorkExpReportResponse {
  workExp: GetWorkExperienceResponse;
  peers: WorkPeerReportResponse[];
}

export interface ResidentialReportResponse {
  residentialInfo: GetResidentialInfoResponse;
  residentialPeers: GetUserPeersResponse[];
}
