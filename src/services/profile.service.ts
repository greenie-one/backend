import { CreateProfileDto, UpdateProfileDto } from '@/dtos/profile.dto';
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
        throw new HttpException('User not found', 404);
      }
    } catch (e) {
      throw new HttpException('User not found', 404);
    }

    const profile = await ProfileModel.create({
      firstName: profileData.first_name,
      lastName: profileData.last_name,
      phone: profileData.phone,
      user: userId,
    });
    return profile;
  }

  @AuthGuard()
  public async updateProfile(userId: string, profileData: UpdateProfileDto): Promise<Profile> {
    const profile = await ProfileModel.findOneAndUpdate(
      { user: userId },
      {
        firstName: profileData.first_name,
        lastName: profileData.last_name,
        phone: profileData.phone,
      },
      { new: true },
    );
    if (!profile) {
      throw new HttpException('Profile not found', 404);
    }
    return profile;
  }
}

export const profileService = new ProfileService();
