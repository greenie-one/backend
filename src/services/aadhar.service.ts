import { AadharCardDto } from '@/dtos/aadhar.dto';
import { HttpException } from '@/exceptions/httpException';
import { AadharCard, AadharCardModel } from '@/models/aadhar.model';
import { UserModel } from '@models/users.model';

export class AadharService {
  public async findAadharByUser(user: string): Promise<AadharCard> {
    const profile = await AadharCardModel.findOne({ user: user });
    if (!profile) {
      throw new HttpException('AadharCard not found', 404);
    }
    return profile;
  }

  public async createAadhar(user: string, aadharData: AadharCardDto): Promise<AadharCard> {
    // Check if user exists
    try {
      const findUser = await UserModel.findById(user);
      if (!findUser) {
        throw new HttpException('User not found', 404);
      }
    } catch (error) {
      throw new HttpException('Error with user id', 403);
    }

    const profile = await AadharCardModel.create({ ...aadharData, user: user });
    return profile;
  }
}
