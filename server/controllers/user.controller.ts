import { NextFunction, Request, Response } from 'express';
import cloudinary from 'cloudinary';
import { CatchAsyncError } from '../middleware/catchAsyncError';
import ErrorHandler from '../utils/ErrorHandler';
import { IUser, UserModel } from '../models/user.model';
import jwt, { JwtPayload } from 'jsonwebtoken';
import ejs from 'ejs';
import path from 'path';
import sendMail from '../utils/sendMail';
import {
  accessTokenOptions,
  refreshTokenOptions,
  sendToken,
} from '../utils/jwt';
import { redis } from '../utils/redis';
import { getUserById } from '../services/user.service';
import env from '../utils/env';
/* register user */
interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export const registrationUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;
      const isEmailExit = await UserModel.findOne({ email });
      if (isEmailExit) {
        return next(new ErrorHandler('Email already exits', 400));
      }
      const user: IRegistrationBody = {
        email,
        name,
        password,
      };
      const activationToken = createActivationToken(user);
      const activationCode = activationToken.activationCode;
      const data = { user: { name: user.name }, activationCode };
      await ejs.renderFile(
        path.join(__dirname, '../mails/activation-mail.ejs'),
        data,
      );
      try {
        await sendMail({
          email: user.email,
          subject: 'Active Email',
          data,
          template: 'activation-mail.ejs',
        });
        console.log(activationCode);
        console.log(activationToken.token);
        res.status(201).json({
          success: true,
          message: `Please check your email ${user.email} to activate your account`,
          activationToken: activationToken.token,
        });
      } catch (error: any) {
        console.log('❄️ ~ file: user.controller.ts:51 ~ error:', error);
        return next(new ErrorHandler(error.message, 400));
      }
    } catch (error: any) {
      console.log('❄️ ~ file: user.controller.ts:54 ~ error:', error);
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

interface IActivationToken {
  token: string;
  activationCode: string;
}
export const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
  const token = jwt.sign({ user, activationCode }, env.ACTIVATION_SECRET, {
    expiresIn: '5m',
  });
  return { token, activationCode };
};

/* activation user */
interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}

export const activateUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_code, activation_token } =
        req.body as IActivationRequest;
      const newUser: { user: IUser; activationCode: string } = jwt.verify(
        activation_token,
        env.ACTIVATION_SECRET,
      ) as { user: IUser; activationCode: string };
      console.log('❄️ ~ file: user.controller.ts:92 ~ newUser:', newUser);
      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler('Invalid activation code', 400));
      }
      const { email, name, password } = newUser.user;
      const existUser = await UserModel.findOne({ email });
      if (existUser) {
        return next(new ErrorHandler('Email already exist', 400));
      }
      await UserModel.create({ email, name, password });
      res.status(201).json({ success: true });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

/* login user */
interface ILoginRequest {
  email: string;
  password: string;
}

export const loginUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginRequest;
      if (!email || !password) {
        return next(new ErrorHandler('Please enter email and password', 400));
      }
      const user = await UserModel.findOne({
        email,
      }).select('+password');
      if (!user) {
        return next(new ErrorHandler("User don't existing", 400));
      }
      const isPasswordMatch = await user.comparedPassword(password);
      if (!isPasswordMatch) {
        return next(new ErrorHandler('Invalid email or password', 400));
      }
      sendToken(user, 200, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

/* logout user */
export const logoutUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.cookie('access_token', '', { maxAge: 1 });
      res.cookie('refresh_token', '', { maxAge: 1 });
      const userID = req.user?._id || '';
      redis.del(userID);
      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {}
  },
);

/* update accessToken */
export const updateAccessToken = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refresh_token = req.cookies.refresh_token;
      const decoded = jwt.verify(
        refresh_token,
        env.REFRESH_TOKEN,
      ) as JwtPayload;
      const message = 'Could not refresh token';
      if (!decoded) {
        return next(new ErrorHandler(message, 400));
      }
      const session = await redis.get(decoded.id);
      if (!session) {
        return next(new ErrorHandler(message, 400));
      }
      const user = JSON.parse(session);
      const accessToken = jwt.sign({ id: user._id }, env.ACCESS_TOKEN, {
        expiresIn: '5m',
      });
      const refreshToken = jwt.sign({ id: user._id }, env.REFRESH_TOKEN, {
        expiresIn: '10m',
      });
      req.user = user;
      res.cookie('access_token', accessToken, accessTokenOptions);
      /*       res.cookie('refresh_token', refreshToken, refreshTokenOptions); */
      res.status(200).json({
        status: 'success',
        accessToken,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

/* get user info */
export const getUserInfo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;
      getUserById(userId, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

interface ISocialAuthBody {
  email: string;
  name: string;
  avatar: string;
}
/* social auth */
export const socialAuth = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name, avatar } = req.body as ISocialAuthBody;
      const user = await UserModel.findOne({ email });
      if (!user) {
        const newUser = await UserModel.create({
          email,
          name,
          avatar: {
            url: avatar,
          },
        });
        sendToken(newUser, 200, res);
      } else {
        sendToken(user, 200, res);
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

/* update user info */
interface IUpdateInfo {
  name?: string;
  email?: string;
}

export const updateUserInfo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name } = req.body as IUpdateInfo;

      const userId = req.user?._id;
      const user = await UserModel.findById(userId);
      if (email && user) {
        const isEmailExit = await UserModel.findOne({ email });
        if (isEmailExit) {
          return next(new ErrorHandler('Email already exist', 400));
        }
        user.email = email;
      }
      if (name && user) {
        user.name = name;
        await user.save();
      }
      await redis.set(userId, JSON.stringify(user));
      res.status(201).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

/* update user password */
interface IUpdatePassword {
  newPassword: string;
  oldPassword: string;
}

export const updateUserPassword = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { newPassword, oldPassword } = req.body as IUpdatePassword;
      console.log(
        '❄️ ~ file: user.controller.ts:286 ~ oldPassword:',
        oldPassword,
      );
      if (!newPassword || !oldPassword) {
        return next(
          new ErrorHandler('Please enter your old or new password', 400),
        );
      }
      const user = await UserModel.findById(req.user?._id).select('+password');
      if (user?.password === undefined) {
        return next(new ErrorHandler('Invalid user', 400));
      }
      const issPasswordMatch = await user?.comparedPassword(oldPassword);
      if (!issPasswordMatch) {
        return next(new ErrorHandler('Invalid old password', 400));
      }
      user.password = newPassword;
      await user.save();
      await redis.set(user._id, JSON.stringify(user));
      res.status(201).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);
type IUpdateProfilePicture = Pick<IUser, 'avatar'>;
/* update profile picture */
export const updateProfilePicture = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { avatar } = req.body as IUpdateProfilePicture;
      const userId = req.user?._id;
      const user = await UserModel.findById(userId);

      if (user && user?.avatar) {
        if (user?.avatar.public_id) {
          await cloudinary.v2.uploader.destroy(user.avatar.public_id);
          const myCloud = await cloudinary.v2.uploader.upload(avatar.url, {
            folder: 'Avatars',
          });
          user.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };
        } else {
          const myCloud = await cloudinary.v2.uploader.upload(avatar.url, {
            folder: 'Avatars',
          });
          user.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };
        }
      }
      await user?.save();
      await redis.set(userId, JSON.stringify(user));
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);
