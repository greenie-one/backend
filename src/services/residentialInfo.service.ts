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
    const old_residential_info = await ResidentialInfoModel.findOne({ _id: residentialInfoId });
    if (!old_residential_info) {
      throw new HttpException(ErrorEnum.RESIDENTIAL_INFO_NOT_FOUND);
    }
    const updated_residential_info = old_residential_info;
    for (const key in residentialInfoData) {
      if (key !== 'residential_info_id') {
        updated_residential_info[key] = residentialInfoData[key];
      }
    }
    await updated_residential_info.save();
    return updated_residential_info;
  }
}

export const residentialInfoService = new ResidentialInfoService();
