import { NextFunction, Request, Response } from 'express';
import CourseModel from '../models/course.model';
import ErrorHandler from '../../utils/ErrorHandler';

export const createCourse = async (
  data: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const course = await CourseModel.create(data);
    console.log('❄️ ~ file: course.service.ts:8 ~ course:', course);
    res.status(201).json({
      success: true,
      course,
    });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
};

/* Get All Courses */
export const getAllCoursesService = async (res: Response) => {
  const courses = await CourseModel.find();
  res.status(201).json({
    success: true,
    courses,
  });
};
