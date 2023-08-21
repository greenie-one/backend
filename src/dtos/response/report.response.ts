import { AllQuestions, DocumentVerification, HRQuestions, SelectedFields, SkillsVerification } from '@/models/workExPeer.model';
import { WorkExperience } from '@/models/workExperience.model';
import { Ref } from '@typegoose/typegoose';
import { WorkVerificationBy } from '../request/workExPeer.dto';
import { IDResponse } from './ids.response';
import { ResidentialInfoResponse } from './residentialInfo.response';
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

export interface documentReportResponse {
  data: [];
}

export interface ResidentialResponse extends ResidentialInfoResponse {
  capturedLocation: object;
  location: object;
}

// --------------------- Final DTOS ---------------------

export interface WorkExpReportResponse {
  workExp: GetWorkExperienceResponse;
  peers: WorkPeerReportResponse[];
  documents: documentReportResponse[];
}

export interface ResidentialReportResponse {
  residentialInfo: ResidentialResponse[];
  residentialPeers: GetUserPeersResponse[];
}

export interface PanReportResponse extends IDResponse {
  phoneNumber: string;
  aadharLinked: boolean;
}

export interface drivingLicenseReportResponse extends IDResponse {
  dateOfIssue: string;
  fatherName: string;
  bloodGroup: string;
  VehicleType: string[];
}

export interface IdReportResonse {
  aadhar: IDResponse;
  pan: PanReportResponse;
  dl: drivingLicenseReportResponse;
}
