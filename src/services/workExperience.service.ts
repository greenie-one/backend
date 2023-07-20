import { AddWorkExperienceResponse, CreateWorkExperienceDto, GetWorkExperienceResponse, UpdateWorkExperienceDto } from '@/dtos/workExperience.dto';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { WorkExperienceModel } from '@/models/workExperience.model';
import { UserModel } from '@models/users.model';

class WorkExperienceService {
  public async createWorkExperience(userId: string, workExperienceData: CreateWorkExperienceDto): Promise<AddWorkExperienceResponse> {
    try {
      // Check if user exists
      const findUser = await UserModel.findById(userId);
      if (!findUser) {
        throw new HttpException(ErrorEnum.USER_NOT_FOUND);
      }
    } catch (e) {
      throw new HttpException(ErrorEnum.USER_NOT_FOUND);
    }
    if (workExperienceData.dateOfLeaving && workExperienceData.dateOfJoining > workExperienceData.dateOfLeaving) {
      throw new HttpException(ErrorEnum.INVALID_DATE);
    }
    const workExperience = await WorkExperienceModel.create({
      ...workExperienceData,
      user: userId,
      dateOfJoining: new Date(workExperienceData.dateOfJoining),
      dateOfLeaving: workExperienceData.dateOfLeaving ? new Date(workExperienceData.dateOfLeaving) : null,
    });
    const res: AddWorkExperienceResponse = { success: true, id: workExperience._id.toString() };
    return res;
  }
  public async getWorkExperience(userId: string): Promise<GetWorkExperienceResponse> {
    const workExperiences = await WorkExperienceModel.find({ user: userId });

    if (!workExperiences) {
      throw new HttpException(ErrorEnum.WORKEXPERIENCE_NOT_FOUND);
    }

    const res: GetWorkExperienceResponse = {
      workExperiences: [],
    };
    for (const workExp of workExperiences) {
      res.workExperiences.push({
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
        dateOfJoining: workExp.dateOfJoining.toString(),
        linkedInUrl: workExp.linkedInUrl,
        dateOfLeaving: workExp.dateOfLeaving.toString(),
      });
    }
    return res;
  }

  public async deleteWorkExperience(userId: string, workExperienceId: string) {
    const workExperience = await WorkExperienceModel.findById(workExperienceId);
    if (!workExperience) {
      throw new HttpException(ErrorEnum.WORKEXPERIENCE_NOT_FOUND);
    }

    if (workExperience.user.toString() !== userId) {
      throw new HttpException(ErrorEnum.UNAUTHORIZED);
    }

    await workExperience.deleteOne();

    return { success: true, message: 'Work experience deleted successfully' };
  }

  public async updateWorkExperience(userId: string, workExperienceId: string, updatedData: UpdateWorkExperienceDto) {
    const workExperience = await WorkExperienceModel.findById(workExperienceId);
    if (!workExperience) {
      throw new HttpException(ErrorEnum.WORKEXPERIENCE_NOT_FOUND);
    }

    if (workExperience.user.toString() !== userId) {
      throw new HttpException(ErrorEnum.UNAUTHORIZED);
    }
    if (!(updatedData.dateOfLeaving && updatedData.dateOfJoining < updatedData.dateOfLeaving)) {
      throw new HttpException(ErrorEnum.INVALID_DATE);
    }
    const updatedWorkExperience = await WorkExperienceModel.findByIdAndUpdate(workExperienceId, { $set: updatedData }, { new: true });

    if (!updatedWorkExperience) {
      throw new HttpException(ErrorEnum.WORKEXPERIENCE_NOT_FOUND);
    }

    return { success: true, message: 'Updated Successfully' };
  }
}

export const workExperienceService = new WorkExperienceService();
