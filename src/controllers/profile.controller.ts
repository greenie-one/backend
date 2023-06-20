import { TokenClaims } from '@/dtos/auth.dto';
import { CreateProfileDto, UpdateProfileDto } from '@/dtos/profile.dto';
import { profileService } from '@/services/profile.service';
import { UserDetails } from '@/utils/decorators/auth';
import { Controller } from '@/utils/decorators/controller';
import { Get, Patch, Post } from '@/utils/decorators/methods';
import { Body, Query } from '@/utils/decorators/request';

@Controller('/profiles')
export default class ProfileController {
  @Post('/create')
  async createProfile(@UserDetails() userDetails: TokenClaims, @Body() data: CreateProfileDto) {
    return profileService.createProfile(userDetails.sub, data);
  }

  @Patch('/update')
  async updateProfile(@UserDetails() userDetails: TokenClaims, @Body() data: UpdateProfileDto) {
    return profileService.updateProfile(userDetails.sub, data);
  }

  @Get('/me')
  async getProfile(@UserDetails() userDetails: TokenClaims) {
    return profileService.getProfile(userDetails.sub);
  }

  @Get('')
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
