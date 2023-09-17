import express from 'express';
import { roles } from '../constant/constant';
import { createOrder, getAllOrders } from '../src/controllers/order.controller';
import { authorizeRoles, isAuthenticated } from '../middleware/auth';
const orderRouter = express.Router();
orderRouter.post('/create-order', isAuthenticated, createOrder);

orderRouter.get(
  '/get-orders',
  isAuthenticated,
  authorizeRoles(roles),
  getAllOrders,
);

export default orderRouter;
