import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';

import { AddResidentialInfoDto, UpdateResidentialInfoDto } from '@/dtos/residentialInfo.dto';
import { ResidentialInfo, ResidentialInfoModel } from '@/models/residentialInfo.model';

class ResidentialInfoService {
  public async getUserResidentialInfo(userId: string): Promise<ResidentialInfo[]> {
    const residentialInfo: ResidentialInfo[] = await ResidentialInfoModel.find({ user: userId });
    if (!residentialInfo) {
      throw new HttpException(ErrorEnum.RESIDENTIAL_INFO_NOT_FOUND);
    }
    return residentialInfo;
  }

  public async addResidentialInfo(userId: string, residentialInfoData: AddResidentialInfoDto): Promise<ResidentialInfo> {
    const residentialInfo = await ResidentialInfoModel.create({
      ...residentialInfoData,
      user: userId,
    });
    return residentialInfo;
  }

  public async deleteResidentialInfo(userId: string, residentialInfoId: string) {
    const residentialInfo = await ResidentialInfoModel.findById(residentialInfoId);
    if (!residentialInfo) {
      throw new HttpException(ErrorEnum.UNAUTHORIZED);
    }

    if (residentialInfo.user.toString() !== userId) {
      throw new HttpException(ErrorEnum.UNAUTHORIZED);
    }

    await residentialInfo.deleteOne();

    return { message: 'Residential Info deleted successfully' };
  }

  public async updateResidentialInfo(userId: string, residentialInfoId: string, updatedData: UpdateResidentialInfoDto) {
    const residentialInfo = await ResidentialInfoModel.findById(residentialInfoId);
    if (!residentialInfo) {
      throw new HttpException(ErrorEnum.UNAUTHORIZED);
    }

    if (residentialInfo.user.toString() !== userId) {
      throw new HttpException(ErrorEnum.UNAUTHORIZED);
    }

    const updatedResidentialInfo = await ResidentialInfoModel.findByIdAndUpdate(residentialInfoId, { $set: updatedData }, { new: true });

    if (!updatedResidentialInfo) {
      throw new HttpException(ErrorEnum.UNAUTHORIZED);
    }

    return updatedResidentialInfo;
  }
}

export const residentialInfoService = new ResidentialInfoService();
