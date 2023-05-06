import { CreateProfileDto } from '@/dtos/profile.dto';
import { Controller } from '@/utils/decorators/controller';
import { Post } from '@/utils/decorators/methods';
import { Body } from '@/utils/decorators/request';
import { profileService } from '@services/profile.service';

@Controller('/profiles')
export default class ProfileController {
  @Post('/create/:userId')
  async createProfile(@Body() data: CreateProfileDto) {
    return profileService.createProfile('', data);
  }

  @Post('/update/:userId')
  async updateProfile(@Body() data: CreateProfileDto) {
    return profileService.updateProfile('', data);
  }
}
