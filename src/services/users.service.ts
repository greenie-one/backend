import { HttpException } from '@/exceptions/httpException';
import { ProfileModel } from '@/models/profile.model';
import { VerificationModel } from '@/models/verified.model';
import { AuthRemote } from '@/remote/auth';
import { CreateUserDto } from '@dtos/users.dto';
import { User, UserModel, UserRoles } from '@models/users.model';
import { compare, hash } from 'bcryptjs';

class UserService {
  public async findAllUser(): Promise<User[]> {
    const users: User[] = await UserModel.find();
    return users;
  }

  public async createUser(userData: CreateUserDto) {
    const orFilter = [];
    if (userData.email) orFilter.push({ email: userData.email });
    if (userData.mobileNumber) orFilter.push({ mobileNumber: userData.mobileNumber });

    const findUser: User = await UserModel.findOne({
      $or: orFilter,
    });

    if (findUser) {
      if (userData.email && userData.email === findUser.email) throw new HttpException(`This email ${userData.email} already exists`, 409);
      else throw new HttpException(`This mobileNumber ${userData.mobileNumber} already exists`, 409);
    }

    const hashedPassword = await hash(userData.password, 10);
    const createUserData = await UserModel.create({
      email: userData.email,
      mobileNumber: userData.mobileNumber,
      roles: [UserRoles.DEFAULT],
      password: hashedPassword,
    });

    await ProfileModel.create({
      first_name: userData.firstName,
      last_name: userData.lastName,
      verification: await VerificationModel.create({
        is_verified: false,
      }),
      user: createUserData._id,
    });

    delete createUserData.password;
    return createUserData;
  }

  public async validateUserByEmail(email: string, password: string) {
    const user = await UserModel.findOne({
      email,
    });

    if (!user) throw new HttpException(`No user by email ${email}`, 401);

    if (!(await compare(password, user.password))) throw new HttpException('Invalid user details', 401);

    return user;
  }

  public async validateByPhoneNumber(mobileNumber: string) {
    const user = await UserModel.findOne({
      mobileNumber,
    });

    if (!user) throw new HttpException(`No user by email ${mobileNumber}`, 401);

    await AuthRemote.requestOtp();

    return user;
  }
}

export const userService = new UserService();
