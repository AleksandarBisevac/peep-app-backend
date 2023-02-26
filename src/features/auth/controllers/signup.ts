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
import { IUserDocument } from '@user/interfaces/userInterface';
import { UserCache } from '@user/redis/userCache';
import { config } from '@root/config';
import { omit } from 'lodash';
import { authQueue } from '@auth/queues/authQueue';
import { userQueue } from '@auth/queues/userQueue';
import JWT from 'jsonwebtoken';

const userCache: UserCache = new UserCache();

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

    // add to Redis cache
    const userDataForCache: IUserDocument = SignUp.prototype.userData(authData, userObjectId);
    userDataForCache.profilePicture = `https://res.cloudinary.com/${config.CLOUD_NAME}/image/upload/v${results.version}/${userObjectId}`;
    await userCache.saveUserToCache(`${userObjectId}`, uId, userDataForCache);

    // Add to database
    omit(userDataForCache, ['uId', 'username', 'email', 'avatarColor', 'password']);
    authQueue.addAuthUserJob('addAuthUserToDB', { value: userDataForCache });
    userQueue.addUserJob('addUserToDB', { value: userDataForCache });

    // send token to user
    const token: string = SignUp.prototype.signToken(authData, userObjectId);
    req.session = { jwt: token };

    res.status(HTTP_STATUS.CREATED).json({
      message: 'User created successfully',
      user: userDataForCache,
      token
    });
  }

  private signToken(data: IAuthDocument, userObjectId: ObjectId): string {
    return JWT.sign(
      {
        userId: userObjectId,
        uId: data.uId,
        email: data.email,
        username: data.username,
        avatarColor: data.avatarColor
      },
      config.JWT_TOKEN!
    );
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

  private userData(data: IAuthDocument, userObjectId: ObjectId): IUserDocument {
    const { _id, uId, username, password, email, avatarColor } = data;
    return {
      _id: userObjectId,
      authId: _id,
      uId,
      username: Helpers.firstLetterToUpperCase(username),
      email: email.toLowerCase(),
      password,
      avatarColor,
      profilePicture: '',
      blocked: [],
      blockedBy: [],
      work: '',
      location: '',
      school: '',
      quote: '',
      bgImageId: '',
      bgImageVersion: '',
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      notifications: {
        messages: true,
        comments: true,
        reactions: true,
        follows: true
      },
      social: {
        facebook: '',
        twitter: '',
        instagram: '',
        youtube: ''
      }
    } as unknown as IUserDocument;
  }
}
