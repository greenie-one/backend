import { UpdateUserDto } from '@/dtos/users.dto';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { User, UserModel } from '@models/users.model';

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
}

export const userService = new UserService();
