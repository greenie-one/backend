import { CreateResidentialInfoDto, UpdateResidentialInfoDto } from '@/dtos/request/residentialInfo.dto';
import {
  CreateResidentialInfoResponse,
  DeleteResidentialInfoResponse,
  GetResidentialInfoResponse,
  UpdateResidentialInfoResponse,
} from '@/dtos/response/residentialInfo.response';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { ResidentialInfo, ResidentialInfoModel } from '@/models/residentialInfo.model';
import { locationService } from './location.service';

class ResidentialInfoService {
  public async getUserResidentialInfo(userId: string): Promise<GetResidentialInfoResponse> {
    const residentialInfos = await ResidentialInfoModel.find({ user: userId });
    if (!residentialInfos) {
      throw new HttpException(ErrorEnum.RESIDENTIAL_INFO_NOT_FOUND);
    }

    return residentialInfos.map((residentialInfo) => ({
      id: residentialInfo._id.toString(),
      address_line_1: residentialInfo.address_line_1,
      address_line_2: residentialInfo.address_line_2,
      landmark: residentialInfo.landmark,
      pincode: residentialInfo.pincode,
      city: residentialInfo.city,
      state: residentialInfo.state,
      country: residentialInfo.country,
      start_date: residentialInfo.start_date,
      end_date: residentialInfo.end_date,
      addressType: residentialInfo.addressType
    }));
  }

  public async createResidentialInfo(userId: string, residentialInfoData: CreateResidentialInfoDto): Promise<CreateResidentialInfoResponse> {
    if (residentialInfoData.end_date) {
      if (!(residentialInfoData.end_date > residentialInfoData.start_date)) {
        throw new HttpException(ErrorEnum.INVALID_DATE);
      }
    }

    const address = `${residentialInfoData.address_line_1}, ${residentialInfoData.address_line_2}, ${residentialInfoData.landmark}, ${residentialInfoData.city}, ${residentialInfoData.state}, ${residentialInfoData.country}`;
    const location = await locationService.createLocation(userId, address);
    const data: ResidentialInfo = {
      ...residentialInfoData,
      user: userId,
      location: location.id,
    };
    const residentialInfo = await ResidentialInfoModel.create(data);

    return {
      id: residentialInfo._id.toString(),
      address_line_1: residentialInfo.address_line_1,
      address_line_2: residentialInfo.address_line_2,
      landmark: residentialInfo.landmark,
      pincode: residentialInfo.pincode,
      city: residentialInfo.city,
      state: residentialInfo.state,
      country: residentialInfo.country,
      start_date: residentialInfo.start_date,
      end_date: residentialInfo.end_date,
      addressType: residentialInfo.addressType
    };
  }

  public async deleteResidentialInfo(userId: string, residentialInfoId: string): Promise<DeleteResidentialInfoResponse> {
    const residentialInfo = await ResidentialInfoModel.findById(residentialInfoId);
    if (!residentialInfo) {
      throw new HttpException(ErrorEnum.RESIDENTIAL_INFO_NOT_FOUND);
    }

    if (residentialInfo.user.toString() !== userId) {
      throw new HttpException(ErrorEnum.UNAUTHORIZED);
    }

    await residentialInfo.deleteOne();

    return {};
  }

  public async updateResidentialInfo(
    userId: string,
    residentialInfoId: string,
    updatedData: UpdateResidentialInfoDto,
  ): Promise<UpdateResidentialInfoResponse> {
    if (updatedData.end_date) {
      if (updatedData.start_date > updatedData.end_date) {
        throw new HttpException(ErrorEnum.INVALID_DATE);
      }
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

    return {
      id: updatedResidentialInfo._id.toString(),
      address_line_1: updatedResidentialInfo.address_line_1,
      address_line_2: updatedResidentialInfo.address_line_2,
      landmark: updatedResidentialInfo.landmark,
      pincode: updatedResidentialInfo.pincode,
      city: updatedResidentialInfo.city,
      state: updatedResidentialInfo.state,
      country: updatedResidentialInfo.country,
      start_date: updatedResidentialInfo.start_date,
      end_date: updatedResidentialInfo.end_date,
      addressType: residentialInfo.addressType
    };
  }
}

export const residentialInfoService = new ResidentialInfoService();
