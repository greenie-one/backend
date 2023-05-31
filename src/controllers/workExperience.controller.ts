import { TokenClaims } from '@/dtos/auth.dto';
import { CreateWorkExperienceDto, UpdateWorkExperienceDto } from '@/dtos/workExperience.dto';
import { workExperienceService } from '@/services/workExperience.service';
import { AuthGuard, UserDetails } from '@/utils/decorators/auth';
import { Controller } from '@/utils/decorators/controller';
import { Delete, Get, Patch, Post } from '@/utils/decorators/methods';
import { Body, Params } from '@/utils/decorators/request';

@Controller('/workExperience')
export default class WorkExperienceController {
  @Post('/create')
  @AuthGuard()
  async createWorkExperience(@UserDetails() userDetails: TokenClaims, @Body() data: CreateWorkExperienceDto) {
    return workExperienceService.createWorkExperience(userDetails.userId, data);
  }

  @Get('/me')
  @AuthGuard()
  async getWorkExperience(@UserDetails() userDetails: TokenClaims) {
    return workExperienceService.getWorkExperience(userDetails.userId);
  }

  @Delete('/:id')
  @AuthGuard()
  async deleteWorkExperience(@UserDetails() userDetails: TokenClaims, @Params('id') id: string) {
    return workExperienceService.deleteWorkExperience(userDetails.userId, id);
  }

  @Patch('/:id')
  @AuthGuard()
  async updateWorkExperience(
    @UserDetails() userDetails: TokenClaims,
    @Params('id') workExpereienceId: string,
    @Body() data: UpdateWorkExperienceDto,
  ) {
    return workExperienceService.updateWorkExperience(userDetails.userId, workExpereienceId, data);
  }
}
