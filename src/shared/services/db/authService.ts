import { IAuthDocument } from '@auth/interfaces/authInterface';
import { AuthModel } from '@auth/models/AuthSchema';
import { Helpers } from '@global/helpers/helper';

class AuthService {
  public async createAuthUser(data: IAuthDocument): Promise<void> {
    await AuthModel.create(data);
  }
  public async getUserByUsernameOrEmail(username: string, email: string): Promise<IAuthDocument | null> {
    const query = {
      $or: [{ username: Helpers.firstLetterToUpperCase(username) }, { email: email.toLowerCase() }]
    };

    const user: IAuthDocument = (await AuthModel.findOne(query).exec()) as IAuthDocument;
    return user;
  }

  public async getAuthUserByEmail(email: string): Promise<IAuthDocument> {
    const user: IAuthDocument = (await AuthModel.findOne({ email: email.toLowerCase() }).exec()) as IAuthDocument;
    return user;
  }
}

export const authService = new AuthService();
