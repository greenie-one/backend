import { CreateProfileDto } from '@/dtos/profile.dto';
import { profileService } from '@/services/profile.service';
import { AuthGuard } from '@/utils/decorators/auth';
import { Controller } from '@/utils/decorators/controller';
import { Post } from '@/utils/decorators/methods';
import { Body, Params } from '@/utils/decorators/request';

@Controller('/profiles')
export default class ProfileController {
  @Post('/create/:userId')
  @AuthGuard()
  async createProfile(@Params('userId') userId: string, @Body() data: CreateProfileDto) {
    return profileService.createProfile(userId, data);
  }

  @Post('/update/:userId')
  @AuthGuard()
  async updateProfile(@Params('userId') userId: string, @Body() data: CreateProfileDto) {
    return profileService.updateProfile(userId, data);
  }
}
