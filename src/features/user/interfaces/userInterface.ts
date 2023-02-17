import { ObjectId } from 'mongodb';
import mongoose, { Document } from 'mongoose';

export interface IUserDocument extends Document {
  _id: string | ObjectId;
  authId: string | ObjectId;
  // this properties we don't save in db
  // we use them inside the redis cache
  uId?: string;
  username?: string;
  email?: string;
  password?: string;
  avatarColor?: string;
  // end of properties we don't save in db
  postsCount: number;
  work: string;
  school: string;
  quote: string;
  location: string;
  blocked: mongoose.Types.ObjectId[];
  blockedBy: mongoose.Types.ObjectId[];
  followersCount: number;
  followingCount: number;
  notifications: INotificationSettings;
  social: ISocialLinks;
  bgImageVersion: string;
  bgImageId: string;
  profilePicture: string;
  passwordResetToken?: string;
  passwordResetExpires?: number | string;
  createdAt?: Date;
}

export interface IUser {
  _id: string | ObjectId;
  authId: string | ObjectId;
  uId: string;
  username: string;
  email: string;
  password?: string;
  avatarColor: string;
  createdAt: Date;
  postsCount: number;
  work: string;
  school: string;
  quote: string;
  location: string;
  blocked: mongoose.Types.ObjectId[];
  blockedBy: mongoose.Types.ObjectId[];
  followersCount: number;
  followingCount: number;
  notifications: INotificationSettings;
  social: ISocialLinks;
  bgImageVersion: string;
  bgImageId: string;
  profilePicture: string;
  passwordResetToken?: string;
  passwordResetExpires?: number | string;
}

export interface IResetPasswordParams {
  username: string;
  email: string;
  ipaddress: string;
  date: string;
}

export interface INotificationSettings {
  messages: boolean;
  reactions: boolean;
  comments: boolean;
  follows: boolean;
}

export interface IBasciInfo {
  quote: string;
  work: string;
  school: string;
  location: string;
}

export interface ISocialLinks {
  facebook: string;
  twitter: string;
  instagram: string;
  youtube: string;
}

export interface ISocketData {
  blockedUser: string;
  blockedBy: string;
}

export interface ILogin {
  userId: string;
}

export interface IUserJobInfo {
  key?: string;
  value?: string | ISocialLinks;
}

export interface IUserJob {
  keyOne?: string;
  keyTwo?: string;
  key?: string;
  value?: string | INotificationSettings | IUserDocument;
}

export interface IAllUsers {
  users: IUserDocument[];
  totalUsers: number;
}
