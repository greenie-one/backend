import { TokenClaims } from '@/dtos/request/auth.dto';
import { UpdateUserDto } from '@/dtos/request/users.dto';
import { userService } from '@/services/users.service';
import { UserDetails } from '@/utils/decorators/auth';
import { Controller } from '@/utils/decorators/controller';
import { Delete, Patch } from '@/utils/decorators/methods';
import { Body } from '@/utils/decorators/request';

@Controller('/user')
export default class UserController {
  @Patch('/update')
  async updateUser(@UserDetails() userDetails: TokenClaims, @Body() data: UpdateUserDto) {
    return userService.updateUser(userDetails.sub, data);
  }

  @Delete('/')
  async deleteUser(@UserDetails() userDetails: TokenClaims) {
    return userService.deleteUser(userDetails.sub)
  }
}
