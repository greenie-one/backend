import { HttpException } from '@/exceptions/httpException';
import { CreateUserDto } from '@dtos/users.dto';
import { UserModel } from '@models/users.model';
import { hash } from 'bcrypt';

export class UserService {
  public async findAllUser(): Promise<User[]> {
    const users: User[] = await UserModel.find();
    return users;
  }

  public async createUser(userData: CreateUserDto) {
    const findUser: User = await UserModel.findOne({ email: userData.email });
    if (findUser) throw new HttpException(`This email ${userData.email} already exists`, 409);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData = await UserModel.create({ ...userData, password: hashedPassword });

    return createUserData;
  }
}
