import express from 'express';
import {
  activateUser,
  getUserInfo,
  loginUser,
  logoutUser,
  registrationUser,
  socialAuth,
  updateAccessToken,
  updateProfilePicture,
  updateUserInfo,
  updateUserPassword,
} from '../controllers/user.controller';
import { authorizeRoles, isAuthenticated } from '../middleware/auth';
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

export default userRouter;
