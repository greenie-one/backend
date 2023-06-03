import { TokenClaims } from '@/dtos/auth.dto';
import { createSkillDto, updateSkillDto } from '@/dtos/skills.dto';
import { skillService } from '@/services/skills.service';
import { AuthGuard, UserDetails } from '@/utils/decorators/auth';
import { Controller } from '@/utils/decorators/controller';
import { Delete, Get, Patch, Post } from '@/utils/decorators/methods';
import { Body, Params } from '@/utils/decorators/request';

@Controller('/skill')
export default class skillController {
  @Post('/create')
  @AuthGuard()
  async createSkill(@UserDetails() userDetails: TokenClaims, @Body() data: createSkillDto) {
    return skillService.createSkill(userDetails.sub, data);
  }

  @Get('/me')
  @AuthGuard()
  async getSkill(@UserDetails() userDetails: TokenClaims) {
    return skillService.getSkills(userDetails.sub);
  }

  @Delete('/:id')
  @AuthGuard()
  async deleteSkill(@UserDetails() userDetails: TokenClaims, @Params('id') id: string) {
    return skillService.deleteSkill(userDetails.sub, id);
  }

  @Patch('/:id')
  @AuthGuard()
  async updateSkill(@UserDetails() userDetails: TokenClaims, @Params('id') skillId: string, @Body() data: updateSkillDto) {
    return skillService.updateSkill(userDetails.sub, skillId, data);
  }
}
