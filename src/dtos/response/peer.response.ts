import { Rating, State, WorkVerificationBy } from '../request/peer.dto';
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

export interface StatusResponse {
  state: State;
}

export interface OptionalWorkExperienceFieldsResponse {
  candidateId?: StatusResponse;
  department?: StatusResponse;
  dateOfJoining?: StatusResponse;
  dateOfLeaving?: StatusResponse;
  companyName?: StatusResponse;
  workType?: StatusResponse;
  workMode?: StatusResponse;
  salary?: StatusResponse;
}

export interface MandatoryWorkExperienceFieldsResponse {
  review?: string;
}

export interface MandatoryQuestionFieldsResponse {
  attitudeRating?: Rating;
  eligibleForRehire?: StatusResponse;
}

export interface HRQuestionFieldsResponse {
  exitProcedure: StatusResponse;
}

interface ExceptHRQuestionFieldsResponse {
  designation: StatusResponse;
  peerPost: StatusResponse;
}

export interface GetPeerInformationResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  verificationBy: WorkVerificationBy;
  optionalVerificationFields?: OptionalWorkExperienceFieldsResponse;
  mandatoryVerificationFields?: MandatoryWorkExperienceFieldsResponse;
  mandatoryQuestionFields?: MandatoryQuestionFieldsResponse;
  otherQuestionFields: HRQuestionFieldsResponse | ExceptHRQuestionFieldsResponse;
  data: GetWorkExperienceDataResponse;
}

