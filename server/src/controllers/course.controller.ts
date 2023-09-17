import cloudinary from 'cloudinary';
import ejs from 'ejs';
import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import path from 'path';

import CourseModel from '../models/course.model';
import NotificationModel from '../models/notification.model';
import { createCourse, getAllCoursesService } from '../services/course.service';
import { CatchAsyncError } from '../../middleware/catchAsyncError';
import { redis } from '../../utils/redis';
import ErrorHandler from '../../utils/ErrorHandler';
import sendMail from '../../utils/sendMail';

/* upload course */
export const uploadCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data?.thumbnail;
      if (thumbnail) {
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: 'courses',
        });
        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
      createCourse(data, res, next);
    } catch (error: any) {
      console.log('❄️ ~ file: course.controller.ts:23 ~ error:', error);
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

/* edit course */
export const editCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data?.thumbnail;
      if (thumbnail) {
        await cloudinary.v2.uploader.destroy(thumbnail.public_id);
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: 'courses',
        });
        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
      const courseId = req.params.id;
      console.log('❄️ ~ file: course.controller.ts:47 ~ courseId:', courseId);
      const course = await CourseModel.findByIdAndUpdate(
        courseId,
        {
          $set: data,
        },
        { new: true },
      );
      res.status(201).json({
        success: true,
        course,
      });
      console.log('❄️ ~ file: course.controller.ts:54 ~ course:', course);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

/* get single course - without purchasing */
export const getSingleCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      /* check if cache existing */
      const courseId = req.params.id;
      const isCacheExit = await redis.get(courseId);
      if (isCacheExit) {
        const course = JSON.parse(isCacheExit);
        res.status(201).json({
          success: true,
          course,
        });
      } else {
        const course = await CourseModel.findById(req.params.id).select(
          '-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links',
        );
        await redis.set(
          courseId,
          JSON.stringify(course),
          'EX',
          604800 /* seconds - 7 days */,
        );

        res.status(200).json({
          success: true,
          course,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

/* get all course - without purchasing */
export const getAllCourses = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isCacheExit = await redis.get('allCourses');
      if (isCacheExit) {
        const courses = JSON.parse(isCacheExit);
        res.status(201).json({
          success: true,
          courses,
        });
      } else {
        const courses = await CourseModel.find().select(
          '-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links',
        );
        res.status(200).json({
          success: true,
          courses,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

/* course content - only for valid user */
export const getCourseByUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;
      console.log(
        '❄️ ~ file: course.controller.ts:128 ~ userCourseList:',
        userCourseList,
      );
      const courseId = req.params.id;
      const courseExists = userCourseList?.find(
        (course: any) => course.courseId === courseId,
      );
      if (!courseExists) {
        return next(
          new ErrorHandler('You are not eligible to access this course ', 400),
        );
      }
      const course = await CourseModel.findById(courseId);
      const content = course?.courseData;
      res.status(201).json({
        success: true,
        content,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

/* add question in course */
interface IAddQuestionData {
  question: string;
  courseId: string;
  contentId: string;
}

export const addQuestion = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ErrorHandler('Please login to perform this action', 400));
    }
    try {
      const { contentId, courseId, question }: IAddQuestionData = req.body;
      const course = await CourseModel.findById(courseId);
      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler('Invalid content id', 400));
      }
      if (!course) {
        return next(new ErrorHandler('Course not found', 400));
      }
      const courseContent = course.courseData.find((item) =>
        item._id.equals(contentId),
      );
      if (!courseContent) {
        return next(new ErrorHandler('Invalid content id', 400));
      }
      /* create a new question object */
      const newQuestion: any = {
        user: req.user,
        question,
        questionReplies: [],
      };
      /* add this question to our course content */
      courseContent.question.push(newQuestion);
      /* create notification */
      await NotificationModel.create({
        user: req.user._id,
        title: 'New Question',
        message: `You have a new question in ${courseContent.title}`,
      });
      /* save the update code */
      await course?.save();
      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

/* add answer in course question */
interface IAddAnswerData {
  answer: string;
  courseId: string;
  contentId: string;
  questionId: string;
}

export const addAnswer = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ErrorHandler('Please login to perform this action', 400));
    }
    try {
      const { answer, contentId, courseId, questionId }: IAddAnswerData =
        req.body;
      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler('Invalid content id', 400));
      }
      const course = await CourseModel.findById(courseId);
      const courseContent = course?.courseData.find((item) =>
        item._id.equals(contentId),
      );
      if (!courseContent) {
        return next(new ErrorHandler('Invalid content id', 400));
      }
      const question = courseContent?.question?.find((item) =>
        item._id.equals(questionId),
      );
      if (!question) {
        return next(new ErrorHandler('Invalid question id', 400));
      }
      /* create new answer */
      const newAnswer: any = {
        user: req.user,
        answer,
      };
      /* add this answer to our course content */
      question.questionReplies.push(newAnswer);
      console.log(
        '❄️ ~ file: course.controller.ts:232 ~ course.courseData:',
        course?.courseData,
      );
      await course?.save();
      if (req.user?._id === question.user._id) {
        /* create notification */
        await NotificationModel.create({
          user: req.user._id,
          title: 'New Question Reply Received',
          message: `You have a new question reply in ${courseContent.title}`,
        });
        res.status(200).json({
          success: true,
          course,
        });
      } else {
        const data = {
          name: question.user.name,
          title: courseContent.title,
        };
        const html = await ejs.renderFile(
          path.join(__dirname, '../mails/question-reply.ejs'),
          data,
        );
        try {
          await sendMail({
            data,
            email: question.user.email,
            subject: 'Question reply',
            template: 'question-reply.ejs',
          });
          res.status(200).json({
            success: true,
            course,
          });
        } catch (error: any) {
          return next(new ErrorHandler(error.message, 400));
        }
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

/* add review in course */
interface IAddReviewData {
  review: string;
  rating: number;
  userId: string;
}

export const addReview = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return next(
          new ErrorHandler('Please login to access this action', 404),
        );
      }
      const userCourseList = req.user.courses;
      const courseId = req.params._id;
      /* check if courseId exist in userCourseList base on _id */
      const courseExists = userCourseList?.some(
        (course: any) => course.courseId === courseId,
      );

      if (!courseExists) {
        return next(
          new ErrorHandler('You are not eligible to access this course', 404),
        );
      }
      const course = await CourseModel.findById(courseId);

      const { rating, review, userId }: IAddReviewData = req.body;
      const reviewData: any = {
        user: req.user,
        comment: review,
        rating,
      };
      if (!course) {
        return next(new ErrorHandler("Course don't existing", 404));
      }
      course.reviews.push(reviewData);
      let avg = 0;
      course.reviews.forEach((review) => {
        avg += review.rating;
      });
      course.ratings = avg / course.reviews.length ?? 1;
      await course.save();
      const notification = {
        title: 'New Review Received',
        message: `${req.user.name} has given a review in ${course.name}`,
      };
      /* create notification */
      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

/* add reply in review - only with admin*/
interface IAddAdminReviewData {
  comment: string;
  courseId: string;
  reviewId: string;
}
export const addReplyToReview = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { comment, courseId, reviewId }: IAddAdminReviewData = req.body;
      const course = await CourseModel.findById(courseId);
      if (!course) {
        return next(new ErrorHandler("Course don't existing", 404));
      }
      const review = course.reviews.find(
        (review) => review._id.toString() === reviewId,
      );
      if (!review) {
        return next(new ErrorHandler('Review not found', 404));
      }
      const replyData: any = {
        user: req.user,
        comment,
      };
      if (!review.commentReplies) {
        review.commentReplies = [];
      }
      review.commentReplies.push(replyData);
      await course.save();
      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

/* get all courses - for admin only */
export const getCourses = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllCoursesService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

/* delete course - for admin only */
export const deleteCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const course = await CourseModel.findByIdAndDelete(id);
      if (!course) {
        return next(new ErrorHandler('Course not found', 404));
      }
      await redis.del(id);
      res.status(200).json({
        success: true,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);
