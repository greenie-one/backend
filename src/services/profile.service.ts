import { CreateProfileDto, UpdateProfileDto } from '@/dtos/profile.dto';
import { HttpException } from '@/exceptions/httpException';
import { Profile, ProfileModel } from '@/models/profile.model';
import { UserModel } from '@models/users.model';

class ProfileService {
  public async createProfile(userId: string, profileData: CreateProfileDto): Promise<Profile> {
    // Check if user exists
    const findUser = await UserModel.findById(userId);
    if (!findUser) {
      throw new HttpException('User not found', 404);
    }

    const profile = await ProfileModel.create({ ...profileData, user: userId });
    return profile;
  }

  public async updateProfile(userId: string, profileData: UpdateProfileDto): Promise<Profile> {
    const profile = await ProfileModel.findOneAndUpdate({ user: userId }, profileData, { new: true });
    if (!profile) {
      throw new HttpException('Profile not found', 404);
    }
    return profile;
  }
}

export const profileService = new ProfileService();
