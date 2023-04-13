import { CreateProfileDto, UpdateProfileDto } from '@/dtos/profile.dto';
import { HttpException } from '@/exceptions/httpException';
import { Profile, ProfileModel } from '@/models/profile.model';
import { UserModel } from '@models/users.model';

export class ProfileService {
  public async findAllProfiles(): Promise<Profile[]> {
    const profiles = await ProfileModel.find();
    return profiles;
  }

  public async findProfileById(user: string): Promise<Profile> {
    const profile = await ProfileModel.findOne({ user: user });
    if (!profile) {
      throw new HttpException('Profile not found', 404);
    }
    return profile;
  }

  public async createProfile(user: string, profileData: CreateProfileDto): Promise<Profile> {
    // Check if user exists
    try {
      const findUser = await UserModel.findById(user);
      if (!findUser) {
        throw new HttpException('User not found', 404);
      }
    } catch (error) {
      throw new HttpException('Error with user id', 403);
    }

    const profile = await ProfileModel.create({ ...profileData, user: user });
    return profile;
  }

  public async updateProfile(user: string, profileData: UpdateProfileDto): Promise<Profile> {
    const profile = await ProfileModel.findOneAndUpdate({ user: user }, profileData, { new: true });
    if (!profile) {
      throw new HttpException('Profile not found', 404);
    }
    return profile;
  }

  public async deleteProfile(user: string): Promise<void> {
    const profile = await ProfileModel.findOneAndDelete({ user: user });
    if (!profile) {
      throw new HttpException('Profile not found', 404);
    }
  }
}
