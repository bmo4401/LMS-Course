import { NextFunction, Response } from 'express';
import { OrderModal } from '../models/order.model';

export const newOrder = async (data: any, next: NextFunction) => {
  const order = await OrderModal.create(data);
  next(order);
};

/* Get All Orders */
export const getAllOrdersService = async (res: Response) => {
  const orders = await OrderModal.find();
  res.status(201).json({
    success: true,
    orders,
  });
};
