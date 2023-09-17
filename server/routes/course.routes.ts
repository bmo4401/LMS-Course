import express from 'express';
import { roles } from '../constant/constant';
import {
  addAnswer,
  addQuestion,
  addReplyToReview,
  addReview,
  deleteCourse,
  editCourse,
  getAllCourses,
  getCourseByUser,
  getCourses,
  getSingleCourse,
  uploadCourse,
} from '../src/controllers/course.controller';
import { authorizeRoles, isAuthenticated } from '../middleware/auth';
const courseRouter = express.Router();
courseRouter.post(
  '/create-course',
  isAuthenticated,
  authorizeRoles(roles),
  uploadCourse,
);
courseRouter.patch(
  '/edit-course/:id',
  isAuthenticated,
  authorizeRoles(roles),
  editCourse,
);

courseRouter.get('/get-course/:id', getSingleCourse);
courseRouter.get('/get-courses', getAllCourses);
courseRouter.get('/get-course-content/:id', isAuthenticated, getCourseByUser);
courseRouter.put('/add-question', isAuthenticated, addQuestion);
courseRouter.put('/add-answer', isAuthenticated, addAnswer);
courseRouter.put('/add-review/:id', isAuthenticated, addReview);
courseRouter.put(
  '/add-reply',
  isAuthenticated,
  authorizeRoles(roles),
  addReplyToReview,
);

courseRouter.get(
  '/get-courses',
  isAuthenticated,
  authorizeRoles(roles),
  getCourses,
);

courseRouter.delete(
  '/delete-course/:id',
  isAuthenticated,
  authorizeRoles(roles),
  deleteCourse,
);
export default courseRouter;
