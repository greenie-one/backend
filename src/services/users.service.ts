import { UpdateUserDto } from '@/dtos/request/users.dto';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { User, UserModel } from '@models/users.model';
import mongoose from 'mongoose';

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
    const updatedUser = await UserModel.findByIdAndUpdate(userId, { $set: updatedData }, { new: true });

    if (!updatedUser) {
      throw new HttpException(ErrorEnum.USER_NOT_FOUND);
    }

    return { success: true, message: 'Updated Successfully' };
  }

  public async deleteUser(userId: string) {
    for (const model of Object.values(mongoose.models)) {
      if ('user' in model.schema.paths) {
        console.debug('Deleting from', model.modelName, 'where user is', userId)
        await model.deleteMany({ user: userId })
      }
    }

    await UserModel.findByIdAndDelete(userId)
  }
}

export const userService = new UserService();
