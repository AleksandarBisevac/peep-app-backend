import { Helpers } from '@global/helpers/helper';
import { ServerError } from '@global/helpers/errorHandler';
import { BaseCache } from '@services/redis/baseCache';
import { IUserDocument } from '@user/interfaces/userInterface';
import Logger from 'bunyan';

const log = new Logger({ name: 'UserCache' });

export class UserCache extends BaseCache {
  constructor() {
    super('userCache');
  }

  public async saveUserToCache(key: string, userUId: string, createdUser: IUserDocument): Promise<void> {
    const createdAd = new Date();
    const {
      _id,
      uId,
      username,
      email,
      avatarColor,
      blocked,
      blockedBy,
      postsCount,
      profilePicture,
      followersCount,
      followingCount,
      notifications,
      work,
      location,
      school,
      quote,
      bgImageId,
      bgImageVersion,
      social
    } = createdUser;

    const firstList: string[] = [
      '_id',
      `${_id}`,
      'uId',
      `${uId}`,
      'username',
      `${username}`,
      'email',
      `${email}`,
      'avatarColor',
      `${avatarColor}`,
      'postsCount',
      `${postsCount}`,
      'createdAd',
      `${createdAd}`
    ];

    const secondList: string[] = [
      'blocked',
      JSON.stringify(blocked),
      'blockedBy',
      JSON.stringify(blockedBy),
      'profilePicture',
      `${profilePicture}`,
      'followersCount',
      `${followersCount}`,
      'followingCount',
      `${followingCount}`,
      'notifications',
      JSON.stringify(notifications),
      'social',
      JSON.stringify(social)
    ];

    const thirdList: string[] = [
      'work',
      `${work}`,
      'location',
      `${location}`,
      'school',
      `${school}`,
      'quote',
      `${quote}`,
      'bgImageId',
      `${bgImageId}`,
      'bgImageVersion',
      `${bgImageVersion}`
    ];

    const dataToSave: string[] = [...firstList, ...secondList, ...thirdList];

    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      await this.client.ZADD('user', { score: parseInt(userUId, 10), value: `${key}` });
      await this.client.HSET(`users:${key}`, dataToSave);
    } catch (error) {
      log.error(error);
      throw new ServerError('Server Error. Try again.');
    }
  }

  public async getUserFromCache(userId: string): Promise<IUserDocument | null> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      const response: IUserDocument = (await this.client.HGETALL(`users:${userId}`)) as unknown as IUserDocument;

      response.createdAt = new Date(Helpers.parseJSON(`${response.createdAt}`));
      response.postsCount = Helpers.parseJSON(`${response.postsCount}`);
      response.social = Helpers.parseJSON(`${response.social}`);
      response.followersCount = Helpers.parseJSON(`${response.followersCount}`);
      response.followingCount = Helpers.parseJSON(`${response.followingCount}`);
      response.notifications = Helpers.parseJSON(`${response.notifications}`);
      response.blocked = Helpers.parseJSON(`${response.blocked}`);
      response.blockedBy = Helpers.parseJSON(`${response.blockedBy}`);

      return response;
    } catch (error) {
      log.error(error);
      throw new ServerError('Server Error. Try again.');
    }
  }
}
