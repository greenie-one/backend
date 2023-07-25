import { CreateWorkExperienceDto, UpdateWorkExperienceDto } from '@/dtos/request/workExperience.dto';
import {
  CreateWorkExperienceResponse,
  GetWorkExperienceResponse,
  UpdateWorkExperienceResponse,
  WorkExperienceResponse,
} from '@/dtos/response/workExperience.response';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { DocumentModel } from '@/models/document.model';
import { SkillModel } from '@/models/skills.model';
import { WorkPeerModel } from '@/models/workExPeer.model';
import { WorkExperienceModel } from '@/models/workExperience.model';
import { UserModel } from '@models/users.model';

class WorkExperienceService {
  public async createWorkExperience(userId: string, workExperienceData: CreateWorkExperienceDto): Promise<CreateWorkExperienceResponse> {
    try {
      // Check if user exists
      const findUser = await UserModel.findById(userId);
      if (!findUser) {
        throw new HttpException(ErrorEnum.USER_NOT_FOUND);
      }
    } catch (e) {
      throw new HttpException(ErrorEnum.USER_NOT_FOUND);
    }

    if (workExperienceData.dateOfLeaving) {
      if (workExperienceData.dateOfJoining > workExperienceData.dateOfLeaving) {
        throw new HttpException(ErrorEnum.INVALID_DATE);
      }
    }

    const workExperience = await WorkExperienceModel.create({
      ...workExperienceData,
      user: userId,
      dateOfJoining: new Date(workExperienceData.dateOfJoining),
      dateOfLeaving: workExperienceData.dateOfLeaving ? new Date(workExperienceData.dateOfLeaving) : null,
    });

    return {
      id: workExperience._id.toString(),
      designation: workExperience.designation,
      companyType: workExperience.companyType,
      email: workExperience.email,
      workMode: workExperience.workMode,
      department: workExperience.department,
      workType: workExperience.workType,
      companyName: workExperience.companyName,
      companyId: workExperience.companyId,
      salary: workExperience.salary,
      reason_for_leaving: workExperience.reason_for_leaving,
      dateOfJoining: workExperience.dateOfJoining,
      linkedInUrl: workExperience.linkedInUrl,
      dateOfLeaving: workExperience.dateOfLeaving,
      noOfVerifications: workExperience.noOfVerifications,
    };
  }

  public async getWorkExperience(userId: string): Promise<GetWorkExperienceResponse> {
    const workExperiences = await WorkExperienceModel.find({ user: userId });

    if (!workExperiences) {
      throw new HttpException(ErrorEnum.WORKEXPERIENCE_NOT_FOUND);
    }

    return workExperiences.map((workExp) => ({
      id: workExp._id.toString(),
      designation: workExp.designation,
      companyType: workExp.companyType,
      email: workExp.email,
      workMode: workExp.workMode,
      department: workExp.department,
      workType: workExp.workType,
      companyName: workExp.companyName,
      companyId: workExp.companyId,
      salary: workExp.salary,
      reason_for_leaving: workExp.reason_for_leaving,
      dateOfJoining: workExp.dateOfJoining,
      linkedInUrl: workExp.linkedInUrl,
      dateOfLeaving: workExp.dateOfLeaving,
      noOfVerifications: workExp.noOfVerifications,
    }));
  }

  public async deleteWorkExperience(userId: string, workExperienceId: string) {
    const workExperience = await WorkExperienceModel.findById(workExperienceId);
    if (!workExperience) {
      throw new HttpException(ErrorEnum.WORKEXPERIENCE_NOT_FOUND);
    }

    if (workExperience.user.toString() !== userId) {
      throw new HttpException(ErrorEnum.UNAUTHORIZED);
    }

    await WorkPeerModel.deleteMany({ user: userId, ref: workExperienceId });
    await SkillModel.deleteMany({ user: userId, workExperience: workExperienceId });
    await DocumentModel.deleteMany({ user: userId, workExperience: workExperienceId });
    await workExperience.deleteOne();
    return { success: true, message: 'Work experience deleted successfully' };
  }

  public async updateWorkExperience(
    userId: string,
    workExperienceId: string,
    updatedData: UpdateWorkExperienceDto,
  ): Promise<UpdateWorkExperienceResponse> {
    const workExperience = await WorkExperienceModel.findById(workExperienceId);
    if (!workExperience) {
      throw new HttpException(ErrorEnum.WORKEXPERIENCE_NOT_FOUND);
    }

    if (workExperience.user.toString() !== userId) {
      throw new HttpException(ErrorEnum.UNAUTHORIZED);
    }

    if (updatedData.dateOfLeaving) {
      if (updatedData.dateOfJoining > updatedData.dateOfLeaving) {
        throw new HttpException(ErrorEnum.INVALID_DATE);
      }
    }
    const updatedWorkExperience = await WorkExperienceModel.findByIdAndUpdate(workExperienceId, { $set: updatedData }, { new: true });

    if (!updatedWorkExperience) {
      throw new HttpException(ErrorEnum.WORKEXPERIENCE_NOT_FOUND);
    }

    return {
      id: updatedWorkExperience._id.toString(),
      designation: updatedWorkExperience.designation,
      companyType: updatedWorkExperience.companyType,
      email: updatedWorkExperience.email,
      workMode: updatedWorkExperience.workMode,
      department: updatedWorkExperience.department,
      workType: updatedWorkExperience.workType,
      companyName: updatedWorkExperience.companyName,
      companyId: updatedWorkExperience.companyId,
      salary: updatedWorkExperience.salary,
      reason_for_leaving: updatedWorkExperience.reason_for_leaving,
      dateOfJoining: updatedWorkExperience.dateOfJoining,
      linkedInUrl: updatedWorkExperience.linkedInUrl,
      dateOfLeaving: updatedWorkExperience.dateOfLeaving,
      noOfVerifications: updatedWorkExperience.noOfVerifications,
    };
  }

  public async getWorkExperienceById(userId: string, id: string): Promise<WorkExperienceResponse> {
    const workExperience = await WorkExperienceModel.findById(id);

    if (!workExperience) {
      throw new HttpException(ErrorEnum.WORKEXPERIENCE_NOT_FOUND);
    }
    if (workExperience.user.toString() !== userId) {
      throw new HttpException(ErrorEnum.UNAUTHORIZED);
    }

    const resp: WorkExperienceResponse = {
      id: workExperience._id.toString(),
      designation: workExperience.designation,
      companyType: workExperience.companyType,
      email: workExperience.email,
      workMode: workExperience.workMode,
      department: workExperience.department,
      workType: workExperience.workType,
      companyName: workExperience.companyName,
      companyId: workExperience.companyId,
      salary: workExperience.salary,
      noOfVerifications: workExperience.noOfVerifications,
      reason_for_leaving: workExperience.reason_for_leaving,
      dateOfJoining: workExperience.dateOfJoining,
      linkedInUrl: workExperience.linkedInUrl,
      dateOfLeaving: workExperience.dateOfLeaving,
    };

    return resp;
  }
}

export const workExperienceService = new WorkExperienceService();
