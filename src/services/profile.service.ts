import { CreateProfileDto, UpdateProfileDto } from '@/dtos/profile.dto';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { DocumentType } from '@/models/document.model';
import { IDTypeEnum } from '@/models/id.model';
import { Profile, ProfileModel } from '@/models/profile.model';
import { documentWeights, scoreConstant } from '@/utils/documentWeight';
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
      profilePic: profileData.profilePic,
      bio: profileData.bio,
      descriptionTags: profileData.descriptionTags,
    });
    return profile;
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

    return updatedProfile;
  }

  public async getProfile(userId: string): Promise<Profile> {
    const profile = await ProfileModel.findOne({ user: userId });
    if (!profile) {
      throw new HttpException(ErrorEnum.PROFILE_NOT_FOUND);
    }
    return profile;
  }

  public async getPercentileRanking(userId: string) {
    const targetScore = (await ProfileModel.findOne({ user: userId }))?.score ?? 0;
    const pipelineStages = [
      {
        $facet: {
          count: [
            {
              $match: { score: { $exists: true } },
            },
            {
              $match: {
                score: { $gt: targetScore },
              },
            },
            {
              $count: 'count',
            },
          ],
          totalCount: [
            {
              $count: 'totalCount',
            },
          ],
        },
      },
      {
        $unwind: '$count',
      },
      {
        $unwind: '$totalCount',
      },
      {
        $project: {
          count: '$count.count',
          totalCount: '$totalCount.totalCount',
          percentage: { $multiply: [{ $divide: ['$count.count', '$totalCount.totalCount'] }, 100] }, // Calculate the percentile
        },
      },
    ];

    const res = (await ProfileModel.collection.aggregate(pipelineStages).toArray())?.[0];
    return { percentile: res?.percentage ?? 1 };
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

  public async modScore(userId: string, documentType: DocumentType | IDTypeEnum, hasUploaded: boolean) {
    let changeInScore = documentWeights[documentType];

    if (typeof changeInScore === 'undefined' || changeInScore === null) {
      console.error('Failed to map document', documentType, 'to weight');
      changeInScore = 1;
    }

    changeInScore *= scoreConstant;

    await ProfileModel.findOneAndUpdate({ user: userId }, { $inc: { score: hasUploaded ? changeInScore : -changeInScore } });
  }
}

export const profileService = new ProfileService();
