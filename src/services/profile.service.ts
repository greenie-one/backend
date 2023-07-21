import { DocumentType } from '@/dtos/request/document.dto';
import { IDTypeEnum } from '@/dtos/request/ids.dto';
import { CreateProfileDto, UpdateProfileDto } from '@/dtos/request/profile.dto';
import { AddProfileResponse, ProfileResponseDto, SearchProfilesResponse } from '@/dtos/response/profile.response';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { ProfileModel } from '@/models/profile.model';
import { documentWeights, scoreConstant } from '@/utils/documentWeight';
import { getRandomGreenieId } from '@/utils/string';
import { UserModel } from '@models/users.model';
import { ClientSession } from 'mongoose';

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
    const res: AddProfileResponse = { success: true, id: profile._id.toString() };
    return res;
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

  public async getProfile(userId: string): Promise<ProfileResponseDto> {
    const profile = await ProfileModel.findOne({ user: userId });
    if (!profile) {
      throw new HttpException(ErrorEnum.PROFILE_NOT_FOUND);
    }

    const res: ProfileResponseDto = {
      id: profile._id.toString(),
      firstName: profile.firstName,
      lastName: profile.lastName,
      profilePic: profile.profilePic,
      bio: profile.bio,
      descriptionTags: profile.descriptionTags,
      greenieId: profile.greenie_id,
    };
    return res;
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

  public async searchByUsername(firstName: string, lastName: string): Promise<SearchProfilesResponse> {
    const regexFirstName = new RegExp(firstName, 'i');
    const regexLastName = new RegExp(lastName, 'i');
    const profiles = await ProfileModel.find({
      $and: [{ firstName: { $regex: regexFirstName } }, { lastName: { $regex: regexLastName } }],
    });

    const res: SearchProfilesResponse = {
      profiles: [],
    };

    if (profiles) {
      for (const profile of profiles) {
        res.profiles.push({
          id: profile._id.toString(),
          firstName: profile.firstName,
          lastName: profile.lastName,
          profilePic: profile.profilePic,
          bio: profile.bio,
          descriptionTags: profile.descriptionTags,
          greenieId: profile.greenie_id,
        });
      }
    }

    return res;
  }

  public async modScore(userId: string, documentType: DocumentType | IDTypeEnum, hasUploaded: boolean, session?: ClientSession) {
    let changeInScore = documentWeights[documentType];

    if (typeof changeInScore === 'undefined' || changeInScore === null) {
      console.error('Failed to map document', documentType, 'to weight');
      changeInScore = 1;
    }

    changeInScore *= scoreConstant;

    await ProfileModel.findOneAndUpdate({ user: userId }, { $inc: { score: hasUploaded ? changeInScore : -changeInScore } }, { session });
  }

  public async generateGreenieId(userId: string, session?: ClientSession) {
    const greenieId = await getRandomGreenieId();

    try {
      await ProfileModel.findOneAndUpdate(
        {
          user: userId,
          greenie_id: null,
        },
        {
          $set: {
            greenie_id: greenieId,
          },
        },
        {
          session,
        },
      );
    } catch (e) {
      if (e.code === 11000 && e.codeName === 'DuplicateKey') {
        return this.generateGreenieId(userId, session);
      }
      throw e;
    }
  }
}

export const profileService = new ProfileService();

