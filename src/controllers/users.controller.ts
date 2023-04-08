import { CreateUserDto } from '@/dtos/users.dto';
import { ValidateDto } from '@/utils/validation';
import { Controller, GET, Inject, POST } from '@fastify-resty/core';
import { User } from '@interfaces/users.interface';
import { UserService } from '@services/users.service';
import { FastifyReply, FastifyRequest } from 'fastify';

@Controller('/users')
export default class UserController {
  @Inject()
  public user: UserService;

  @GET('/')
  public async getUsers(req: FastifyRequest, res: FastifyReply) {
    const findAllUsersData: User[] = await this.user.findAllUser();

    res.status(200).send({ data: findAllUsersData, message: 'findAll' });
  }

  @ValidateDto(CreateUserDto, 'body')
  @POST('/')
  public async createUser(req: FastifyRequest<{ Body: User }>, res: FastifyReply) {
    const userData: User = req.body;
    const createUserData = await this.user.createUser(userData);

    res.status(201).send({ data: createUserData, message: 'created' });
  }
}
