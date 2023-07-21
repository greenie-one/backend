import { TokenClaims } from '@/dtos/request/auth.dto';
import { CreateWorkExperienceDto, UpdateWorkExperienceDto } from '@/dtos/request/workExperience.dto';
import { workExperienceService } from '@/services/workExperience.service';
import { UserDetails } from '@/utils/decorators/auth';
import { Controller } from '@/utils/decorators/controller';
import { Delete, Get, Patch, Post } from '@/utils/decorators/methods';
import { Body, Params } from '@/utils/decorators/request';

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

  @Delete('/:id')
  async deleteWorkExperience(@UserDetails() userDetails: TokenClaims, @Params('id') id: string) {
    return workExperienceService.deleteWorkExperience(userDetails.sub, id);
  }

  @Patch('/:id')
  async updateWorkExperience(
    @UserDetails() userDetails: TokenClaims,
    @Params('id') workExpereienceId: string,
    @Body() data: UpdateWorkExperienceDto,
  ) {
    return workExperienceService.updateWorkExperience(userDetails.sub, workExpereienceId, data);
  }
}

