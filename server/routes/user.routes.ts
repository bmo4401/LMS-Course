import express from 'express';

import { authorizeRoles, isAuthenticated } from '../middleware/auth';
import { roles } from '../constant/constant';
import {
  registrationUser,
  activateUser,
  createActivationToken,
  deleteUser,
  getAllUsers,
  getUserInfo,
  loginUser,
  logoutUser,
  socialAuth,
  updateAccessToken,
  updateProfilePicture,
  updateUserInfo,
  updateUserPassword,
  updateUserRole,
} from '../src/controllers/user.controller';
const userRouter = express.Router();
userRouter.post('/registration', registrationUser);
userRouter.post('/activate-user', activateUser);
userRouter.post('/login', loginUser);
userRouter.get(
  '/logout',
  isAuthenticated,
  /*   authorizeRoles(['admin']), */
  logoutUser,
);
userRouter.get('/refresh', updateAccessToken);
userRouter.get('/me', isAuthenticated, getUserInfo);
userRouter.post('/social-auth', socialAuth);
userRouter.patch('/update-user-info', isAuthenticated, updateUserInfo);
userRouter.patch('/update-user-password', isAuthenticated, updateUserPassword);
userRouter.patch('/update-user-avatar', isAuthenticated, updateProfilePicture);

userRouter.get(
  '/get-users',
  isAuthenticated,
  authorizeRoles(roles),
  getAllUsers,
);

userRouter.get(
  '/update-user-role',
  isAuthenticated,
  authorizeRoles(roles),
  updateUserRole,
);

userRouter.delete(
  '/update-user/:id',
  isAuthenticated,
  authorizeRoles(roles),
  deleteUser,
);
export default userRouter;
