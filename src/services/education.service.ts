import { CreateEducationHistoryDto, UpdateEducationHistoryDto } from '@/dtos/education.dto';
import { HttpException } from '@/exceptions/httpException';
import { EducationHistory, EducationHistoryModel } from '@/models/education.model';
import { UserModel } from '@models/users.model';

export class EducationHistoryService {
  public async findAllEducationHistories(): Promise<EducationHistory[]> {
    const educationHistories = await EducationHistoryModel.find();
    return educationHistories;
  }

  public async findEducationHistoryById(userId: string): Promise<EducationHistory[]> {
    const educationHistory = await EducationHistoryModel.find({ user: userId });
    if (!educationHistory) {
      throw new HttpException('Education history not found', 404);
    }
    return educationHistory;
  }

  public async createEducationHistory(userId: string, educationHistoryData: CreateEducationHistoryDto): Promise<EducationHistory> {
    // Check if user exists
    const findUser = await UserModel.findById(userId);
    if (!findUser) {
      throw new HttpException('User not found', 404);
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
      throw new HttpException('Education history not found', 404);
    }
    return educationHistory;
  }

  public async deleteEducationHistory(educationHistoryId: string): Promise<void> {
    const educationHistory = await EducationHistoryModel.findByIdAndDelete(educationHistoryId);
    if (!educationHistory) {
      throw new HttpException('Education history not found', 404);
    }
  }
}
