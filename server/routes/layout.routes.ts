import express from 'express';
import { roles } from '../constant/constant';

import { authorizeRoles, isAuthenticated } from '../middleware/auth';
import {
  createLayout,
  editLayout,
  getLayoutByType,
} from '../src/controllers/layout.controller';
const layoutRouter = express.Router();
layoutRouter.post(
  '/create-layout',
  isAuthenticated,
  authorizeRoles(roles),
  createLayout,
);

layoutRouter.post(
  '/edit-layout',
  isAuthenticated,
  authorizeRoles(roles),
  editLayout,
);

layoutRouter.get('/get-layout', getLayoutByType);

export default layoutRouter;
