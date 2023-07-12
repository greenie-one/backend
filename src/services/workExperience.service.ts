import { AddWorkExperienceResponse, CreateWorkExperienceDto, FieldDto, GetWorkExperienceResponse, UpdateWorkExperienceDto } from '@/dtos/workExperience.dto';
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

    if (
      !(
        workExperienceData.companyStartDate &&
        workExperienceData.companyEndDate &&
        workExperienceData.companyStartDate < workExperienceData.companyEndDate
      )
    ) {
      throw new HttpException(ErrorEnum.INVALID_DATE);
    }

    const workExperience = await WorkExperienceModel.create({
      ...workExperienceData,
      user: userId,
      companyStartDate: new Date(workExperienceData.companyStartDate),
      companyEndDate: new Date(workExperienceData.companyEndDate),
    });
    return { success: true, workExperienceId: workExperience._id.toString() };
  }

  public async getWorkExperience(userId: string): Promise<GetWorkExperienceResponse> {
    const workExperiences = await WorkExperienceModel.find({ user: userId });

    if (!workExperiences) {
      throw new HttpException(ErrorEnum.WORKEXPERIENCE_NOT_FOUND);
    }

    const workExpArry = [];
    for (const workExp of workExperiences) {
      const workExpObj: FieldDto = {
        workExpId: workExp._id.toString(),
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
        companyStartDate: workExp.companyStartDate.toString(),
        linkedInUrl: workExp.linkedInUrl,
        companyEndDate: workExp.companyEndDate.toString(),
      };
      workExpArry.push(workExpObj);
    }
    return { workExperinces: workExpArry };
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
    if (!(updatedData.companyStartDate && updatedData.companyEndDate && updatedData.companyStartDate < updatedData.companyEndDate)) {
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
