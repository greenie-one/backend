import { CompanyTypeEnum } from '../request/workExperience.dto';

export interface AddWorkExperienceResponse {
  id: string;
  success: boolean;
}

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
  createdAt: Date;
  updatedAt?: Date;
}

export interface GetWorkExperienceResponse {
  workExperiences: WorkExperienceResponse[];
}
