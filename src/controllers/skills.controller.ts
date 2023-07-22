import { TokenClaims } from '@/dtos/request/auth.dto';
import { CreateSkillDto } from '@/dtos/request/skills.dto';
import { skillService } from '@/services/skills.service';
import { UserDetails } from '@/utils/decorators/auth';
import { Controller } from '@/utils/decorators/controller';
import { Get, Post } from '@/utils/decorators/methods';
import { Body } from '@/utils/decorators/request';

@Controller('/skill')
export default class skillController {
  @Post('/create')
  async createSkill(@UserDetails() userDetails: TokenClaims, @Body() data: CreateSkillDto) {
    return skillService.createSkill(userDetails.sub, data);
  }

  @Get('/get')
  async getSkill(@UserDetails() userDetails: TokenClaims) {
    return skillService.getSkills(userDetails.sub);
  }
}

