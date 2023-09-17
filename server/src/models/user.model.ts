import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Role } from '../../constant/constant';
import env from '../../utils/env';
const emailRegexPattern: RegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar: {
    public_id: string;
    url: string;
  };
  role: Role;
  isVerified: boolean;
  courses: { courseId: string }[];
  comparedPassword: (password: string) => Promise<boolean>;
  SignAccessToken: () => string;
  SignRefreshToken: () => string;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter your name'],
    },
    email: {
      type: String,
      validate: {
        validator: (value: string) => {
          return emailRegexPattern.test(value);
        },
        message: 'please enter a valid email',
      },
      unique: true,
    },
    password: {
      type: String,
      minlength: [6, 'Please must be at least 6 characters'],
      select: false,
    },
    avatar: {
      public_id: String,
      url: String,
    },
    role: {
      type: String,
      default: 'user',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    courses: [
      {
        courseId: String,
      },
    ],
  },
  { timestamps: true },
);

/* hash password */
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
/* sign accessToken */
userSchema.methods.SignAccessToken = function () {
  return jwt.sign({ id: this._id }, env.ACCESS_TOKEN, {
    expiresIn: '5h',
  });
};

/* sign refreshToken */
userSchema.methods.SignRefreshToken = function () {
  return jwt.sign({ id: this._id }, env.REFRESH_TOKEN, {
    expiresIn: '10h',
  });
};
/* compare password */
userSchema.methods.comparedPassword = async function (
  enteredPassword: string,
): Promise<boolean> {
  console.log(
    '❄️ ~ file: user.model.ts:89 ~ enteredPassword:',
    enteredPassword,
  );
  console.log(this);
  return await bcrypt.compare(enteredPassword, this.password);
};

export const UserModel: Model<IUser> = mongoose.model('User', userSchema);
