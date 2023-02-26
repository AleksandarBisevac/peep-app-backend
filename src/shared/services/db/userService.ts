import { IUserDocument } from '@user/interfaces/userInterface';
import { UserModel } from '@user/models/UserSchema';

class UserService {
  public async addUserData(data: IUserDocument): Promise<void> {
    await UserModel.create(data);
  }
}

export const userService: UserService = new UserService();
