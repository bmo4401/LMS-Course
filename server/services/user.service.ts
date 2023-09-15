import { NextFunction, Request, Response } from 'express';
import { UserModel } from '../models/user.model';
import { redis } from '../utils/redis';

/* get user by id */
export const getUserById = async (id: string, res: Response) => {
  const userJson = await redis.get(id);
  if (userJson) {
    const user = JSON.parse(userJson);
    return res.status(201).json({ success: true, user });
  }
};
