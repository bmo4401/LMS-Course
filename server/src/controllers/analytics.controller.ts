import { NextFunction, Request, Response } from 'express';

import { UserModel } from '../models/user.model';
import CourseModel from '../models/course.model';
import { OrderModal } from '../models/order.model';
import { CatchAsyncError } from '../../middleware/catchAsyncError';
import { generateLast12MonthsData } from '../../utils/analytics.generator';
import ErrorHandler from '../../utils/ErrorHandler';

/* get users analytics - only for admin  */
export const getUsersAnalytics = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await generateLast12MonthsData(UserModel);
      res.status(200).json({
        success: true,
        users,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

/* get courses analytics - only for admin  */
export const getCoursesAnalytics = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courses = await generateLast12MonthsData(CourseModel);
      res.status(200).json({
        success: true,
        courses,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

/* get orders analytics - only for admin  */
export const getOrdersAnalytics = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await generateLast12MonthsData(OrderModal);
      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);
