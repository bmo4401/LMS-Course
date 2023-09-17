import express from 'express';
import { roles } from '../constant/constant';
import {
  getCoursesAnalytics,
  getOrdersAnalytics,
  getUsersAnalytics,
} from '../src/controllers/analytics.controller';
import { authorizeRoles, isAuthenticated } from '../middleware/auth';
const analyticsRouter = express.Router();
analyticsRouter.get(
  '/get-users-analytics',
  isAuthenticated,
  authorizeRoles(roles),
  getUsersAnalytics,
);

analyticsRouter.get(
  '/get-courses-analytics',
  isAuthenticated,
  authorizeRoles(roles),
  getCoursesAnalytics,
);

analyticsRouter.get(
  '/get-orders-analytics',
  isAuthenticated,
  authorizeRoles(roles),
  getOrdersAnalytics,
);

export default analyticsRouter;
