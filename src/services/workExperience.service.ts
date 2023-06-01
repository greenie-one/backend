import { CreateWorkExperienceDto, UpdateWorkExperienceDto } from '@/dtos/workExperience.dto';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { WorkExperienceModel } from '@/models/workExperience.model';
import { UserModel } from '@models/users.model';

class WorkExperienceService {
  public async createWorkExperience(userId: string, workExperienceData: CreateWorkExperienceDto) {
    try {
      // Check if user exists
      const findUser = await UserModel.findById(userId);
      if (!findUser) {
        throw new HttpException(ErrorEnum.USER_NOT_FOUND);
      }
    } catch (e) {
      throw new HttpException(ErrorEnum.USER_NOT_FOUND);
    }

    const WorkExperience = await WorkExperienceModel.create({
      image: workExperienceData.image,
      designation: workExperienceData.designation,
      companyId: workExperienceData.companyId,
      email: workExperienceData.email,
      user: userId,
      companyName: workExperienceData.companyName,
      companyStartDate: new Date(workExperienceData.companyStartDate),
      companyEndDate: new Date(workExperienceData.companyEndDate),
      workType: workExperienceData.workType,
      workMode: workExperienceData.workMode,
      isVerified: workExperienceData.isVerified,
      description: workExperienceData.description,
    });
    return WorkExperience;
  }

  public async getWorkExperience(userId: string) {
    const WorkExperience = await WorkExperienceModel.find({ user: userId });

    if (!WorkExperience) {
      throw new HttpException(ErrorEnum.WORKEXPERIENCE_NOT_FOUND);
    }
    return WorkExperience;
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

    return { message: 'Work experience deleted successfully' };
  }

  public async updateWorkExperience(userId: string, workExperienceId: string, updatedData: UpdateWorkExperienceDto) {
    const workExperience = await WorkExperienceModel.findById(workExperienceId);
    if (!workExperience) {
      throw new HttpException(ErrorEnum.WORKEXPERIENCE_NOT_FOUND);
    }

    if (workExperience.user.toString() !== userId) {
      throw new HttpException(ErrorEnum.UNAUTHORIZED);
    }
    const updatedWorkExperience = await WorkExperienceModel.findByIdAndUpdate(workExperienceId, { $set: updatedData }, { new: true });

    if (!updatedWorkExperience) {
      throw new HttpException(ErrorEnum.WORKEXPERIENCE_NOT_FOUND);
    }

    return updatedWorkExperience;
  }
}

export const workExperienceService = new WorkExperienceService();
