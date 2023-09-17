import express from 'express';
import { authorizeRoles, isAuthenticated } from '../middleware/auth';

import { roles } from '../constant/constant';
import {
  getNotifications,
  updateNotification,
} from '../src/controllers/notification.controller';
const notificationRouter = express.Router();
notificationRouter.get(
  '/get-notifications',
  isAuthenticated,
  authorizeRoles(roles),
  getNotifications,
);

notificationRouter.put(
  '/update-notification/:id',
  isAuthenticated,
  authorizeRoles(roles),
  updateNotification,
);

export default notificationRouter;
