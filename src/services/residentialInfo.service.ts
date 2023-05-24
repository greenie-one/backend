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

  public async updateResidentialInfo(userId: string, residentialInfoData: UpdateResidentialInfoDto): Promise<ResidentialInfo> {
    const residentialInfoId = residentialInfoData.residential_info_id;
    delete residentialInfoData.residential_info_id;
    const residentialInfo = await ResidentialInfoModel.findOneAndUpdate({ _id: residentialInfoId, user: userId }, residentialInfoData, { new: true });
    if (!residentialInfo) {
      throw new HttpException(ErrorEnum.RESIDENTIAL_INFO_NOT_FOUND);
    }
    return residentialInfo;
  }
}

export const residentialInfoService = new ResidentialInfoService();
