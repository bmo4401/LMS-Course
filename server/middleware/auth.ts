import { NextFunction, Request, Response } from 'express';
import { CatchAsyncError } from './catchAsyncError';
import ErrorHandler from '../utils/ErrorHandler';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { redis } from '../utils/redis';
import env from '../utils/env';
import { Role } from '../constant/constant';
/* authenticated user */
export const isAuthenticated = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token;
    if (!access_token) {
      return next(
        new ErrorHandler('Please login to access this resource', 401),
      );
    }
    const decoded = (await jwt.verify(
      access_token,
      env.ACCESS_TOKEN,
    )) as JwtPayload;
    if (!decoded) {
      return next(new ErrorHandler('Access Token is not valid', 400));
    }
    const user = await redis.get(decoded.id);
    if (!user) {
      return next(
        new ErrorHandler('Please login to access this resource.', 400),
      );
    }
    req.user = JSON.parse(user);
    next();
  },
);

/* validate user role */
export const authorizeRoles = (roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role || 'user')) {
      return next(
        new ErrorHandler(
          `Role ${req.user?.role} is not allowed to access this resource.`,
          403,
        ),
      );
    }
    next();
  };
};
