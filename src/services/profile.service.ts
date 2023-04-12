import { HttpException } from '@/exceptions/httpException';
import { UserModel } from '@models/users.model';
import { Profile, ProfileModel } from '@/models/profile.model';
import { CreateProfileDto, UpdateProfileDto } from '@/dtos/profile.dto';

export class ProfileService {
  public async findAllProfiles(): Promise<Profile[]> {
    const profiles = await ProfileModel.find();
    return profiles;
  }

  public async createProfile(profileData: CreateProfileDto): Promise<Profile> {
    // Check if user exists
    try {
      const findUser = await UserModel.findById(profileData.user);
      if (!findUser) {
        throw new HttpException('User not found', 404);
      }
    } catch (error) {
      throw new HttpException('Error with user id', 403);
    }

    const profile = await ProfileModel.create(profileData);
    return profile;
  }

  public async updateProfile(user: string, profileData: UpdateProfileDto): Promise<Profile> {
    const profile = await ProfileModel.findOneAndUpdate({ user: user }, profileData, { new: true });
    if (!profile) {
      throw new HttpException('Profile not found', 404);
    }
    return profile;
  }

  public async deleteProfile(profileId: string): Promise<void> {
    const profile = await ProfileModel.findByIdAndDelete(profileId);
    if (!profile) {
      throw new HttpException('Profile not found', 404);
    }
  }
}
