import { CompanyTypeEnum } from '../request/workExperience.dto';

export type CreateWorkExperienceResponse = WorkExperienceResponse;
export type UpdateWorkExperienceResponse = WorkExperienceResponse;

export interface WorkExperienceResponse {
  id: string;
  designation: string;
  companyType: CompanyTypeEnum;
  email: string;
  workMode: string;
  department: string;
  reason_for_leaving: string;
  salary: string;
  workType: string;
  companyName: string;
  companyId: string;
  dateOfJoining: Date;
  linkedInUrl: string;
  dateOfLeaving: Date;
  noOfVerifications: number;
}

export type GetWorkExperienceResponse = WorkExperienceResponse[];
