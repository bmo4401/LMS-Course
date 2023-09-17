import { Response } from 'express';
import { UserModel } from '../models/user.model';
import { redis } from '../../utils/redis';
import { Role } from '../../constant/constant';

/* get user by id */
export const getUserById = async (id: string, res: Response) => {
  const userJson = await redis.get(id);
  if (userJson) {
    const user = JSON.parse(userJson);
    return res.status(201).json({ success: true, user });
  }
};

/* Get All users */
export const getAllUsersService = async (res: Response) => {
  const users = await UserModel.find();
  res.status(201).json({
    success: true,
    users,
  });
};

/* Update user role */
export const updateUserRoleService = async (
  id: string,
  role: Role,
  res: Response,
) => {
  const user = await UserModel.findByIdAndUpdate(id, { role }, { new: true });
  res.status(201).json({
    success: true,
    user,
  });
};
