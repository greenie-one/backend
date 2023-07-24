import { TokenClaims } from '@/dtos/request/auth.dto';
import { CreateProfileDto, UpdateProfileDto } from '@/dtos/request/profile.dto';
import {
  CreateProfileResponse,
  GetProfileRankingResponse,
  GetProfileResponse,
  SearchProfilesResponse,
  UpdateProfileResponse,
} from '@/dtos/response/profile.response';
import { profileService } from '@/services/profile.service';
import { UserDetails } from '@/utils/decorators/auth';
import { Controller } from '@/utils/decorators/controller';
import { Get, Patch, Post } from '@/utils/decorators/methods';
import { Body, Query } from '@/utils/decorators/request';

@Controller('/profiles')
export default class ProfileController {
  @Post('/create')
  async createProfile(@UserDetails() userDetails: TokenClaims, @Body() data: CreateProfileDto): Promise<CreateProfileResponse> {
    return profileService.createProfile(userDetails.sub, data);
  }

  @Patch('/update')
  async updateProfile(@UserDetails() userDetails: TokenClaims, @Body() data: UpdateProfileDto): Promise<UpdateProfileResponse> {
    return profileService.updateProfile(userDetails.sub, data);
  }

  @Get('/me')
  async getProfile(@UserDetails() userDetails: TokenClaims): Promise<GetProfileResponse> {
    return profileService.getProfile(userDetails.sub);
  }

  @Get('')
  async searchProfile(@Query('search') searchValue: string): Promise<SearchProfilesResponse> {
    if (searchValue.startsWith('GRN')) {
      const greenieId = searchValue;
      return profileService.searchById(greenieId);
    } else {
      const [firstName, lastName] = searchValue.split(' ');
      return profileService.searchByUsername(firstName, lastName);
    }
  }

  @Get('/me/ranking')
  async getRanking(@UserDetails() userDetails: TokenClaims): Promise<GetProfileRankingResponse> {
    return profileService.getPercentileRanking(userDetails.sub);
  }
}
