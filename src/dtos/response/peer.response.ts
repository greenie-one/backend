import {
  ExceptHRQuestionFields,
  HRQuestionFields,
  MandatoryQuestionFields,
  MandatoryWorkExFields,
  OptionalWorkExFields,
} from '@/models/peer.model';
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
}

export interface GetWorkExperienceDataResponse extends Partial<WorkExperienceResponse> {
  name: string;
  profilePic: string;
  peerPost?: string;
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
  optionalVerificationFields?: OptionalWorkExFields;
  mandatoryVerificationFields?: MandatoryWorkExFields;
  mandatoryQuestionFields?: MandatoryQuestionFields;
  otherQuestionFields: HRQuestionFields | ExceptHRQuestionFields;
  data: GetWorkExperienceDataResponse;
}

