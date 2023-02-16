import { IAuthDocument } from '@auth/interfaces/authInterface';
import { model, Model, Schema } from 'mongoose';
import { hash, compare } from 'bcryptjs';

const SALT_WORK_FACTOR = 10;

const authSchema: Schema = new Schema(
  {
    username: {
      type: String
    },
    uId: {
      type: String
    },
    email: {
      type: String
    },
    password: {
      type: String
    },
    avatarColor: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    toJSON: {
      transform(_doc, ret) {
        delete ret.password;
        return ret;
      }
    }
  }
);

authSchema.pre('save', async function (this: IAuthDocument, next: () => void) {
  const hashedPassword = await hash(this.password as string, SALT_WORK_FACTOR);
  this.password = hashedPassword;
  next();
});

authSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  const hashedPassword: string = (this as unknown as IAuthDocument).password!;
  return compare(password, hashedPassword);
};

authSchema.methods.hashPassword = async function (password: string): Promise<string> {
  return hash(password, SALT_WORK_FACTOR);
};

const AuthModel: Model<IAuthDocument> = model<IAuthDocument>('Auth', authSchema, 'Auth');
export { AuthModel };
