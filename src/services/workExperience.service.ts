import { CreateWorkExperienceDto } from '@/dtos/workExperience.dto';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { WorkExperienceModel } from '@/models/WorkExperience.model';
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
      user: userId,
      companyName: workExperienceData.companyName,
      companyStartYear: new Date(workExperienceData.companyStartYear),
      companyEndYear: new Date(workExperienceData.companyEndYear),
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
}

export const workExperienceService = new WorkExperienceService();
