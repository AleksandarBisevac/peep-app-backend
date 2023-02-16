import HTTP_STATUS from 'http-status-codes';
import { UploadApiResponse } from 'cloudinary';
import { Response, Request } from 'express';
import { ObjectId } from 'mongodb';
import { joiValidate } from '@decorators/joiValidation';
import { signupSchema } from '@auth/schemes/signup';
import { authService } from '@services/db/authService';
import { BadRequestError } from '@global/helpers/errorHandler';
import { Helpers } from '@global/helpers/helper';
import { ISignUpData, IAuthDocument } from '@auth/interfaces/authInterface';
import { uploads } from '@global/helpers/cloudinaryUpload';

export class SignUp {
  @joiValidate(signupSchema)
  public async create(req: Request, res: Response): Promise<void> {
    const { username, email, password, avatarColor, avatarImage } = req.body;
    const checkIfUserExists = await authService.getUserByUsernameOrEmail(username, email);

    if (checkIfUserExists) {
      throw new BadRequestError('Invalid credentials');
    }

    const authObjectId: ObjectId = new ObjectId(); // id for auth document created for user
    const userObjectId: ObjectId = new ObjectId(); // id for user document that will be created for user

    const uId = `${Helpers.generateRandomIntegers(12)}`;
    const authData: IAuthDocument = SignUp.prototype.signupData({
      _id: authObjectId,
      uId,
      username,
      email,
      password,
      avatarColor
    });

    // upload avatar image to cloudinary
    // https://cloudinary.com/someUser/userObjectId
    // if user changes the image, the image will be uploaded to the same url
    const results: UploadApiResponse = (await uploads(avatarImage, `${userObjectId}`, true, true)) as UploadApiResponse;
    if (!results?.public_id) {
      throw new BadRequestError('Image upload failed, please try again.');
    }

    res.status(HTTP_STATUS.CREATED).json({
      message: 'User created successfully',
      data: authData
    });
  }

  private signupData(data: ISignUpData): IAuthDocument {
    const { _id, uId, username, email, password, avatarColor } = data;
    return {
      _id,
      uId,
      username: Helpers.firstLetterToUpperCase(username),
      email: email.toLowerCase(),
      password,
      avatarColor,
      createdAt: new Date()
    } as IAuthDocument;
  }
}
