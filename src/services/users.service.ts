import { UpdateUserDto } from '@/dtos/users.dto';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { User, UserModel, UserRoles } from '@models/users.model';
import { compare } from 'bcryptjs';

class UserService {
  public async findAllUser(): Promise<User[]> {
    const users: User[] = await UserModel.find();
    return users;
  }

  public async findUser({ id, email, mobileNumber }: { id?: string; email?: string; mobileNumber?: string }) {
    if (id) {
      return UserModel.findById(id);
    }

    const orMap = [];
    if (email) orMap.push({ email });
    if (mobileNumber) orMap.push({ mobileNumber });
    const user = UserModel.findOne({
      $or: orMap,
    });

    return user;
  }

  public async createUser(userData: User) {
    const orFilter = [];
    if (userData.email) orFilter.push({ email: userData.email });
    if (userData.mobileNumber) orFilter.push({ mobileNumber: userData.mobileNumber });

    const findUser: User = await UserModel.findOne({
      $or: orFilter,
    });

    if (findUser) {
      if (userData.email && userData.email === findUser.email) throw new HttpException(ErrorEnum.USER_ALREADY_EXISTS);
      else throw new HttpException(ErrorEnum.USER_ALREADY_EXISTS);
    }

    const createUserData = await UserModel.create({
      email: userData.email,
      mobileNumber: userData.mobileNumber,
      roles: [UserRoles.DEFAULT],
      password: userData.password, // Should already be hashed
    });

    delete createUserData.password;
    return createUserData;
  }

  public async updateUser(userId: string, updatedData: UpdateUserDto) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new HttpException(ErrorEnum.USER_NOT_FOUND);
    }

    const updatedUser = await UserModel.findByIdAndUpdate(userId, { $set: updatedData }, { new: true });

    if (!updatedUser) {
      throw new HttpException(ErrorEnum.USER_NOT_FOUND);
    }

    return updatedUser;
  }

  public async validateUserByEmail(email: string, password: string) {
    const user = await UserModel.findOne({
      email,
    });

    if (!user) throw new HttpException(ErrorEnum.USER_NOT_FOUND);
    if (!user.password) throw new HttpException(ErrorEnum.USER_NO_PASSWORD);

    if (!(await compare(password, user.password))) throw new HttpException(ErrorEnum.PASSWORD_MISMATCH);

    delete user.password;
    return user;
  }

  public async validateByPhoneNumber(mobileNumber: string) {
    const user = await UserModel.findOne({
      mobileNumber,
    });

    if (!user) throw new HttpException(ErrorEnum.USER_NOT_FOUND);

    delete user.password;
    return user;
  }
}

export const userService = new UserService();
