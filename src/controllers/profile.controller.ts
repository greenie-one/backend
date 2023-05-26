import { TokenClaims } from '@/dtos/auth.dto';
import { CreateProfileDto, UpdateProfileDto } from '@/dtos/profile.dto';
import { profileService } from '@/services/profile.service';
import { AuthGuard, UserDetails } from '@/utils/decorators/auth';
import { Controller } from '@/utils/decorators/controller';
import { Get, Post } from '@/utils/decorators/methods';
import { Body, Query } from '@/utils/decorators/request';

@Controller('/profiles')
export default class ProfileController {
  @Post('/create')
  @AuthGuard()
  async createProfile(@UserDetails() userDetails: TokenClaims, @Body() data: CreateProfileDto) {
    return profileService.createProfile(userDetails.userId, data);
  }

  @Post('/update')
  @AuthGuard()
  async updateProfile(@UserDetails() userDetails: TokenClaims, @Body() data: UpdateProfileDto) {
    return profileService.updateProfile(userDetails.userId, data);
  }

  @Get('/me')
  @AuthGuard()
  async getProfile(@UserDetails() userDetails: TokenClaims) {
    return profileService.getProfile(userDetails.userId);
  }

  @Get('')
  @AuthGuard()
  async searchProfile(@Query('search') searchValue: string) {
    if (searchValue.startsWith('GRN')) {
      const greenieId = searchValue;
      return profileService.searchById(greenieId);
    } else {
      const [firstName, lastName] = searchValue.split(' ');
      return profileService.searchByUsername(firstName, lastName);
    }
  }
}
