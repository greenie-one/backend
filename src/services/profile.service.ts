import { CreateProfileDto, UpdateProfileDto } from '@/dtos/profile.dto';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { Profile, ProfileModel } from '@/models/profile.model';
import { AuthGuard } from '@/utils/decorators/auth';
import { UserModel } from '@models/users.model';

class ProfileService {
  @AuthGuard()
  public async createProfile(userId: string, profileData: CreateProfileDto): Promise<Profile> {
    try {
      // Check if user exists
      const findUser = await UserModel.findById(userId);
      if (!findUser) {
        throw new HttpException(ErrorEnum.USER_NOT_FOUND);
      }
    } catch (e) {
      throw new HttpException(ErrorEnum.USER_NOT_FOUND);
    }

    const findProfile = ProfileModel.findOne({
      user: userId,
    });

    if (findProfile) throw new HttpException(ErrorEnum.PROFILE_ALREADY_EXISTS);

    const profile = await ProfileModel.create({
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      user: userId,
      descriptionTags: profileData.descriptionTags,
    });
    return profile;
  }

  @AuthGuard()
  public async updateProfile(userId: string, profileData: UpdateProfileDto): Promise<Profile> {
    const profile = await ProfileModel.findOneAndUpdate(
      { user: userId },
      {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        descriptionTags: profileData.descriptionTags,
      },
      { new: true },
    );
    if (!profile) {
      throw new HttpException(ErrorEnum.PROFILE_NOT_FOUND);
    }
    return profile;
  }
}

export const profileService = new ProfileService();
