import { TokenClaims } from '@/dtos/auth.dto';
import { UpdateUserDto } from '@/dtos/users.dto';
import { userService } from '@/services/users.service';
import { UserDetails } from '@/utils/decorators/auth';
import { Controller } from '@/utils/decorators/controller';
import { Patch } from '@/utils/decorators/methods';
import { Body } from '@/utils/decorators/request';

@Controller('/user')
export default class userCont {
  @Patch('/update')
  async updateSkill(@UserDetails() userDetails: TokenClaims, @Body() data: UpdateUserDto) {
    return userService.updateUser(userDetails.sub, data);
  }
}
