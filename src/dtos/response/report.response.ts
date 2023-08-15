import { Skills } from '@/models/skills.model';
import { WorkExperience } from '@/models/workExperience.model';
import { Ref } from '@typegoose/typegoose';
import { Document } from 'mongoose';
import { Rating, State, WorkVerificationBy } from '../request/workExPeer.dto';
import { WorkExperienceResponse } from './workExperience.response';

interface Status {
  state: State;
  dispute_type?: string | null;
  dispute_reason?: string | null;
}

interface SelectedFields {
  candidateId: Status;
  department: Status;
  dateOfJoining: Status;
  dateOfLeaving: Status;
  companyName: Status;
  workType: Status;
  workMode: Status;
  companyId: Status;
  salary: Status;
}

interface AllQuestions {
  attitudeRating: Rating;
  designation: Status;
  peerPost: Status;
  review: string;
}

interface HRQuestions {
  exitProcedure: Status;
  eligibleForRehire: Status;
}

interface SkillsVerification {
  id: Ref<Skills, string>;
  status?: Status;
}

interface DocumentVerification {
  id: Ref<Document, string>;
  status?: Status;
}

interface WorkPeerReportResponse {
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
  workExp: WorkExperienceResponse;
  peers: WorkPeerReportResponse[];
}
