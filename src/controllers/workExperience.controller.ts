import { TokenClaims } from '@/dtos/auth.dto';
import { CreateWorkExperienceDto } from '@/dtos/workExperience.dto';
import { workExperienceService } from '@/services/workExperience.service';
import { UserDetails } from '@/utils/decorators/auth';
import { Controller } from '@/utils/decorators/controller';
import { Get, Post } from '@/utils/decorators/methods';
import { Body } from '@/utils/decorators/request';

@Controller('/workExperience')
export default class WorkExperienceController {
  @Post('/create')
  async createWorkExperience(@UserDetails() userDetails: TokenClaims, @Body() data: CreateWorkExperienceDto) {
    return workExperienceService.createWorkExperience(userDetails.sub, data);
  }

  @Get('/me')
  async getWorkExperience(@UserDetails() userDetails: TokenClaims) {
    return workExperienceService.getWorkExperience(userDetails.sub);
  }
}
