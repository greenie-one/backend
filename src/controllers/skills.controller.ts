import { TokenClaims } from '@/dtos/auth.dto';
import { createSkillDto } from '@/dtos/skills.dto';
import { skillService } from '@/services/skills.service';
import { AuthGuard, UserDetails } from '@/utils/decorators/auth';
import { Controller } from '@/utils/decorators/controller';
import { Delete, Get, Post } from '@/utils/decorators/methods';
import { Body, Params } from '@/utils/decorators/request';

@Controller('/skill')
export default class skillController {
  @Post('/create')
  @AuthGuard()
  async createSkill(@UserDetails() userDetails: TokenClaims, @Body() data: createSkillDto) {
    return skillService.createSkill(userDetails.userId, data);
  }

  @Get('/me')
  @AuthGuard()
  async getSkill(@UserDetails() userDetails: TokenClaims) {
    return skillService.getSkills(userDetails.userId);
  }

  @Delete('/:id')
  @AuthGuard()
  async deleteWorkExperience(@UserDetails() userDetails: TokenClaims, @Params('id') id: string) {
    return skillService.deleteSkill(userDetails.userId, id);
  }
}
