import { AddProfileResponse, CreateProfileDto, GetProfileResponse, GetSearchedProfilesResponse, UpdateProfileDto } from '@/dtos/profile.dto';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { ProfileModel } from '@/models/profile.model';
import { UserModel } from '@models/users.model';

class ProfileService {
  public async createProfile(userId: string, profileData: CreateProfileDto): Promise<AddProfileResponse> {
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
      profilePic: profileData.profilePic,
      bio: profileData.bio,
      descriptionTags: profileData.descriptionTags,
    });
    return { success: true, profileId: profile._id.toString() };
  }

  public async updateProfile(userId: string, updatedData: UpdateProfileDto) {
    const profile = await ProfileModel.findOne({ user: userId });
    if (!profile) {
      throw new HttpException(ErrorEnum.PROFILE_NOT_FOUND);
    }

    const updatedProfile = await ProfileModel.findByIdAndUpdate(profile._id, { $set: updatedData }, { new: true });

    if (!updatedProfile) {
      throw new HttpException(ErrorEnum.PROFILE_NOT_FOUND);
    }

    return { success: true, message: 'Updated Successfully' };
  }

  public async getProfile(userId: string): Promise<GetProfileResponse> {
    const profile = await ProfileModel.findOne({ user: userId });
    if (!profile) {
      throw new HttpException(ErrorEnum.PROFILE_NOT_FOUND);
    }

    const profileObj = {
      profileId: profile._id.toString(),
      firstName: profile.firstName,
      lastName: profile.lastName,
      profilePic: profile.profilePic,
      bio: profile.bio,
      descriptionTags: profile.descriptionTags,
    };

    return profileObj;
  }

  public async searchById(id: string) {
    const profiles = await ProfileModel.find({ greenie_id: id });
    return profiles;
  }

  public async searchByUsername(firstName: string, lastName: string): Promise<GetSearchedProfilesResponse> {
    const regexFirstName = new RegExp(firstName, 'i');
    const regexLastName = new RegExp(lastName, 'i');
    const profiles = await ProfileModel.find({
      $and: [{ firstName: { $regex: regexFirstName } }, { lastName: { $regex: regexLastName } }],
    });

    const profileArry = [];

    if (profiles) {
      for (const profile of profiles) {
        const profileObj = {
          profileId: profile._id.toString(),
          firstName: profile.firstName,
          lastName: profile.lastName,
          profilePic: profile.profilePic,
          bio: profile.bio,
          descriptionTags: profile.descriptionTags,
        };
        profileArry.push(profileObj);
      }
    }

    return { profiles: profileArry };
  }
}

export const profileService = new ProfileService();
