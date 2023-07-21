import { AddResidentialInfoDto, UpdateResidentialInfoDto } from '@/dtos/request/residentialInfo.dto';
import { AddResidentialInfoResponse, GetResidentialInfoResponse } from '@/dtos/response/residentialInfo.response';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';

import { ResidentialInfoModel } from '@/models/residentialInfo.model';

class ResidentialInfoService {
  public async getUserResidentialInfo(userId: string): Promise<GetResidentialInfoResponse> {
    const residentialInfos = await ResidentialInfoModel.find({ user: userId });
    if (!residentialInfos) {
      throw new HttpException(ErrorEnum.RESIDENTIAL_INFO_NOT_FOUND);
    }

    const res: GetResidentialInfoResponse = {
      residentialInfos: [],
    };
    for (const residentialInfo of residentialInfos) {
      res.residentialInfos.push({
        id: residentialInfo._id.toString(),
        address_line_1: residentialInfo.address_line_1,
        address_line_2: residentialInfo.address_line_2,
        landmark: residentialInfo.landmark,
        pincode: residentialInfo.pincode,
        city: residentialInfo.city,
        state: residentialInfo.state,
        country: residentialInfo.country,
        start_date: residentialInfo.start_date.toString(),
        end_date: residentialInfo.end_date.toString() ? residentialInfo.end_date.toString() : Date.now().toString(),
      });
    }

    return res;
  }

  public async addResidentialInfo(userId: string, residentialInfoData: AddResidentialInfoDto): Promise<AddResidentialInfoResponse> {
    if (!(residentialInfoData.end_date && residentialInfoData.end_date > residentialInfoData.start_date)) {
      throw new HttpException(ErrorEnum.INVALID_DATE);
    }
    const residentialInfo = await ResidentialInfoModel.create({
      ...residentialInfoData,
      user: userId,
    });

    const res: AddResidentialInfoResponse = { success: true, id: residentialInfo._id.toString() };
    return res;
  }

  public async deleteResidentialInfo(userId: string, residentialInfoId: string) {
    const residentialInfo = await ResidentialInfoModel.findById(residentialInfoId);
    if (!residentialInfo) {
      throw new HttpException(ErrorEnum.RESIDENTIAL_INFO_NOT_FOUND);
    }

    if (residentialInfo.user.toString() !== userId) {
      throw new HttpException(ErrorEnum.UNAUTHORIZED);
    }

    await residentialInfo.deleteOne();

    return { success: true, message: 'Residential Info deleted successfully' };
  }

  public async updateResidentialInfo(userId: string, residentialInfoId: string, updatedData: UpdateResidentialInfoDto) {
    if (!(updatedData.end_date && updatedData.end_date > updatedData.start_date)) {
      throw new HttpException(ErrorEnum.INVALID_DATE);
    }
    const residentialInfo = await ResidentialInfoModel.findById(residentialInfoId);
    if (!residentialInfo) {
      throw new HttpException(ErrorEnum.RESIDENTIAL_INFO_NOT_FOUND);
    }

    if (residentialInfo.user.toString() !== userId) {
      throw new HttpException(ErrorEnum.UNAUTHORIZED);
    }

    const updatedResidentialInfo = await ResidentialInfoModel.findByIdAndUpdate(residentialInfoId, { $set: updatedData }, { new: true });

    if (!updatedResidentialInfo) {
      throw new HttpException(ErrorEnum.RESIDENTIAL_INFO_NOT_FOUND);
    }

    return { success: true, message: 'Updated Successfully' };
  }
}

export const residentialInfoService = new ResidentialInfoService();

