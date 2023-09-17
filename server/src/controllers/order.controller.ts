import { NextFunction, Request, Response } from 'express';
import { IOrder } from '../models/order.model';
import { UserModel } from '../models/user.model';
import CourseModel from '../models/course.model';
import { getAllOrdersService, newOrder } from '../services/order.service';
import ejs from 'ejs';
import path from 'path';
import NotificationModel from '../models/notification.model';
import { CatchAsyncError } from '../../middleware/catchAsyncError';
import ErrorHandler from '../../utils/ErrorHandler';
import sendMail from '../../utils/sendMail';

/* create order */

export const createOrder = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return next(
          new ErrorHandler('Please login to perform this action', 400),
        );
      }

      const { courseId, payment_info } = req.body as IOrder;
      const user = await UserModel.findById(req.user._id);
      const courseExistInUser = user?.courses.some(
        (course) => course.courseId === courseId,
      );
      if (courseExistInUser) {
        return next(
          new ErrorHandler('You have already purchase this course', 400),
        );
      }
      const course = await CourseModel.findById(courseId);
      if (!course) {
        return next(new ErrorHandler('Course not found', 404));
      }
      const data: any = {
        courseId: course._id,
        userId: user?._id,
      };
      newOrder(data, next);
      const mailData = {
        order: {
          _id: course._id.toString().slice(0, 6),
          name: course.name,
          price: course.price,
          date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        },
      };
      const html = await ejs.renderFile(
        path.join(__dirname, '../mails/order-confirmation.ejs'),
        { ...mailData },
      );
      try {
        if (user) {
          await sendMail({
            data,
            email: user.email,
            subject: 'Order Confirmation',
            template: 'order-confirmation.ejs',
          });
        }
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
      user?.courses.push(course._id);
      await user?.save();
      await NotificationModel.create({
        user: user?._id,
        title: 'New Order',
        message: `You have a new order from  ${course.name}`,
      });
      course.purchased++;
      await course.save();
      res.status(201).json({
        success: true,
        order: course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

/* get all orders - for admin only */
export const getAllOrders = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllOrdersService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);
