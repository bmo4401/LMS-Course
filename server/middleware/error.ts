import { NextFunction, Request, Response } from 'express';
import ErrorHandler from '../utils/ErrorHandler';

type Error = {
  statusCode: number;
  message: string;
  name: string;
  path?: string;
  code?: number;
  keyValue?: string;
};
export const ErrorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal server error.';
  /* wrong mongodb id error */
  if (err.name === 'CastError') {
    const message = `Request not found. Invalid  ${err.path}`;
    err = new ErrorHandler(message, 400);
  }
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue!)} entered`;
    err = new ErrorHandler(message, 400);
  }
  /* wrong jwt error */
  if (err.name === 'JwtWebTokenError') {
    const message = `Json web token is invalid, try again`;
    err = new ErrorHandler(message, 400);
  }

  /* jwt expired error */
  if (err.name === 'TokenExpiredError') {
    const message = `JWT is expired, try again`;
    err = new ErrorHandler(message, 400);
  }
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
