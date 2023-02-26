import { IUserDocument } from './../../user/interfaces/userInterface';
import { IAuthDocument } from './../interfaces/authInterface';
import HTTP_STATUS from 'http-status-codes';
import { Request, Response } from 'express';
import { config } from '@root/config';
import JWT from 'jsonwebtoken';
import { joiValidate } from '@decorators/joiValidation';
import { BadRequestError } from '@global/helpers/errorHandler';
import { loginSchema } from '@auth/schemes/login';
import { authService } from '@services/db/authService';
import { userService } from '@services/db/userService';

export class SignIn {
  @joiValidate(loginSchema)
  public async read(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    const existingUser: IAuthDocument = await authService.getAuthUserByEmail(email);
    if (!existingUser) {
      throw new BadRequestError('User does not exist');
    }

    const isPasswordCorrect: boolean = await existingUser.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new BadRequestError('Invalid password');
    }

    const user: IUserDocument = await userService.getUserByAuthId(`${existingUser._id}`);

    if (!user) {
      throw new BadRequestError('User does not exist');
    }

    const jwt: string = JWT.sign(
      {
        userId: user._id,
        uId: existingUser.uId,
        email: existingUser.email,
        username: existingUser.username,
        avatarColor: existingUser.avatarColor
      },
      config.JWT_TOKEN!
    );
    req.session = { jwt };

    const userDocument: IUserDocument = {
      ...user,
      authId: `${existingUser._id}`,
      username: existingUser!.username,
      email: existingUser!.email,
      avatarColor: existingUser!.avatarColor,
      uId: existingUser!.uId,
      createdAt: existingUser!.createdAt
    } as IUserDocument;

    res.status(HTTP_STATUS.OK).json({ message: 'User logged in successfully', user: userDocument, token: jwt });
  }
}