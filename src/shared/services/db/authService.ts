import { IAuthDocument } from '@auth/interfaces/authInterface';
import { AuthModel } from '@auth/models/AuthSchema';
import { Helpers } from '@global/helpers/helper';

class AuthService {
  public async getUserByUsernameOrEmail(username: string, email: string): Promise<IAuthDocument | null> {
    const query = {
      $or: [{ username: Helpers.firstLetterToUpperCase(username) }, { email: email.toLowerCase() }]
    };

    const user: IAuthDocument = (await AuthModel.findOne(query).exec()) as IAuthDocument;
    return user;
  }
}

export const authService = new AuthService();
