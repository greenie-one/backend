import { AadharCardDto } from '@/dtos/aadhar.dto';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { AadharCard, AadharCardModel } from '@/models/aadhar.model';
import { UserModel } from '@models/users.model';

export class AadharService {
  public async findAadharByUser(user: string): Promise<AadharCard> {
    const profile = await AadharCardModel.findOne({ user: user });
    if (!profile) {
      throw new HttpException(ErrorEnum.AADHAR_NOT_FOUND);
    }
    return profile;
  }

  public async createAadhar(user: string, aadharData: AadharCardDto): Promise<AadharCard> {
    // Check if user exists
    try {
      const findUser = await UserModel.findById(user);
      if (!findUser) {
        throw new HttpException(ErrorEnum.USER_NOT_FOUND);
      }
    } catch (error) {
      throw new HttpException(ErrorEnum.INVALID_USER_ID);
    }

    const profile = await AadharCardModel.create({ ...aadharData, user: user });
    return profile;
  }
}
