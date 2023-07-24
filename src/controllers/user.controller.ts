import { TokenClaims } from '@/dtos/request/auth.dto';
import { UpdateUserDto } from '@/dtos/request/users.dto';
import { UpdateUserResponse } from '@/dtos/response/users.response';
import { userService } from '@/services/users.service';
import { UserDetails } from '@/utils/decorators/auth';
import { Controller } from '@/utils/decorators/controller';
import { Patch } from '@/utils/decorators/methods';
import { Body } from '@/utils/decorators/request';

@Controller('/user')
export default class UserController {
  @Patch('/update')
  async updateUser(@UserDetails() userDetails: TokenClaims, @Body() data: UpdateUserDto): Promise<UpdateUserResponse> {
    return userService.updateUser(userDetails.sub, data);
  }
}
