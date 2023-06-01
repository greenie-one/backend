import { CreateProfileDto, ProfileChangedEntity, UpdateProfileDto } from '@/dtos/profile.dto';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { Profile, ProfileModel } from '@/models/profile.model';
import { UserModel } from '@models/users.model';

class ProfileService {
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

    const findProfile = await ProfileModel.findOne({
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

  private getUpdateProfileChanges(profileData: UpdateProfileDto) {
    const changes: Partial<Profile> = {};
    if (profileData.changedEntity === ProfileChangedEntity.NAME) {
      changes.firstName = profileData.firstName;
      changes.lastName = profileData.lastName;
    }

    if (profileData.changedEntity === ProfileChangedEntity.DESCRIPTION_TAGS) {
      changes.descriptionTags = profileData.descriptionTags;
    }

    return changes;
  }

  public async updateProfile(userId: string, profileData: UpdateProfileDto): Promise<Profile> {
    const profile = await ProfileModel.findOneAndUpdate({ user: userId }, this.getUpdateProfileChanges(profileData), { new: true });
    if (!profile) {
      throw new HttpException(ErrorEnum.PROFILE_NOT_FOUND);
    }
    return profile;
  }

  public async getProfile(userId: string): Promise<Profile> {
    const profile = await ProfileModel.findOne({ user: userId });
    if (!profile) {
      throw new HttpException(ErrorEnum.PROFILE_NOT_FOUND);
    }
    return profile;
  }

  public async searchById(id: string) {
    const profiles = await ProfileModel.find({ greenie_id: id });
    return profiles;
  }

  public async searchByUsername(firstName: string, lastName: string) {
    const regexFirstName = new RegExp(firstName, 'i');
    const regexLastName = new RegExp(lastName, 'i');
    const profiles = await ProfileModel.find({
      $and: [{ firstName: { $regex: regexFirstName } }, { lastName: { $regex: regexLastName } }],
    });

    return profiles;
  }
}

export const profileService = new ProfileService();
