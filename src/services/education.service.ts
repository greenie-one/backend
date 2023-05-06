import { CreateEducationHistoryDto, UpdateEducationHistoryDto } from '@/dtos/education.dto';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { EducationHistory, EducationHistoryModel } from '@/models/education.model';
import { UserModel } from '@models/users.model';

export class EducationHistoryService {
  public async findEducationHistoryById(userId: string): Promise<EducationHistory[]> {
    const educationHistory = await EducationHistoryModel.find({ user: userId });
    if (!educationHistory) {
      throw new HttpException(ErrorEnum.EDUCATION_NOT_FOUND);
    }
    return educationHistory;
  }

  public async createEducationHistory(userId: string, educationHistoryData: CreateEducationHistoryDto): Promise<EducationHistory> {
    // Check if user exists
    const findUser = await UserModel.findById(userId);
    if (!findUser) {
      throw new HttpException(ErrorEnum.USER_NOT_FOUND);
    }

    const educationHistory = new EducationHistoryModel({
      ...educationHistoryData,
      user: userId,
    });

    const createdEducationHistory = await educationHistory.save();
    return createdEducationHistory;
  }

  public async updateEducationHistory(educationHistoryId: string, educationHistoryData: UpdateEducationHistoryDto): Promise<EducationHistory> {
    const educationHistory = await EducationHistoryModel.findByIdAndUpdate(educationHistoryId, educationHistoryData, { new: true });
    if (!educationHistory) {
      throw new HttpException(ErrorEnum.EDUCATION_NOT_FOUND);
    }
    return educationHistory;
  }

  public async deleteEducationHistory(educationHistoryId: string): Promise<void> {
    const educationHistory = await EducationHistoryModel.findByIdAndDelete(educationHistoryId);
    if (!educationHistory) {
      throw new HttpException(ErrorEnum.EDUCATION_NOT_FOUND);
    }
  }
}
