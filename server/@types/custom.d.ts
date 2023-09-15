import { CookieOptions } from 'express';
import { IUser } from '../models/user.model';

type Cookies = 'access_token' | 'refresh_token';
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
    interface Response {
      json: {
        status: boolean;
      };
    }
  }
}
