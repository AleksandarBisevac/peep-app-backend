import { IUserDocument } from '@user/interfaces/userInterface';
import { UserModel } from '@user/models/UserSchema';
import mongoose from 'mongoose';

class UserService {
  public async addUserData(data: IUserDocument): Promise<void> {
    await UserModel.create(data);
  }

  public async getUserById(userId: string): Promise<IUserDocument> {
    const users: IUserDocument[] = await UserModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(userId) } },
      { $lookup: { from: 'Auth', localField: 'authId', foreignField: '_id', as: 'authId' } },
      { $unwind: '$authId' },
      { $project: this.aggregateProject() }
    ]);
    return users[0];
  }

  public async getUserByAuthId(authId: string): Promise<IUserDocument> {
    const users: IUserDocument[] = await UserModel.aggregate([
      // $match is a stage in the aggregation pipeline that filters the documents to pass only the documents that match the specified condition(s) to the next stage in the pipeline.
      { $match: { authId: new mongoose.Types.ObjectId(authId) } },
      // $lookup is a stage that performs a left outer join to another collection in the same database to filter in documents from the “joined” collection for processing.
      { $lookup: { from: 'Auth', localField: 'authId', foreignField: '_id', as: 'authId' } },
      // $unwind is a stage that deconstructs an array field from the input documents to output a document for each element.
      { $unwind: '$authId' },
      // $project is a stage that reshapes each document in the stream, such as by adding new fields or removing existing fields.
      { $project: this.aggregateProject() }
    ]);
    return users[0];
  }

  // aggregateProject() is a helper function that returns an object that is used in the $project stage of the aggregation pipeline.
  private aggregateProject() {
    return {
      _id: 1,
      username: '$authId.username',
      uId: '$authId.uId',
      email: '$authId.email',
      avatarColor: '$authId.avatarColor',
      createdAt: '$authId.createdAt',
      postsCount: 1,
      work: 1,
      school: 1,
      quote: 1,
      location: 1,
      blocked: 1,
      blockedBy: 1,
      followersCount: 1,
      followingCount: 1,
      notifications: 1,
      social: 1,
      bgImageVersion: 1,
      bgImageId: 1,
      profilePicture: 1
    };
  }
}

export const userService: UserService = new UserService();
