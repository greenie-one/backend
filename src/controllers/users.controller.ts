import { CreateUserDto } from '@/dtos/users.dto';
import { Controller } from '@/utils/decorators/controller';
import { Get, Post } from '@/utils/decorators/methods';
import { ValidateDto } from '@/utils/validation';
import { UserService } from '@services/users.service';
import { FastifyReply, FastifyRequest } from 'fastify';

@Controller('/users')
export default class UserController {
  public user: UserService = new UserService();

  @Get('/')
  public async getUsers(req: FastifyRequest, res: FastifyReply) {
    const findAllUsersData: User[] = await this.user.findAllUser();

    res.status(200).send({ data: findAllUsersData, message: 'findAll' });
  }

  @ValidateDto(CreateUserDto, 'body')
  @Post('/')
  public async createUser(req: FastifyRequest<{ Body: User }>, res: FastifyReply) {
    const userData: User = req.body;
    const createUserData = await this.user.createUser(userData);

    res.status(201).send({ data: createUserData, message: 'created' });
  }
}
