import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import FailError from '../errors/FailError';

import { User } from '../models/User';

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, lastname, nickName, email, password, role, image } = req.body;
    const newUser = {
      name,
      lastname,
      nickName,
      email,
      password,
      role,
      image,
    };
    newUser.password = bcrypt.hashSync(password, 10);

    if (!newUser) throw new FailError('Error user not found.');

    const existUser = await User.find({
      $or: [{ email: newUser.email.toLowerCase() }, { nickName: newUser.nickName.toLowerCase() }],
    });

    if (existUser && existUser.length >= 1) throw new FailError('User already exists.');

    const user = new User(newUser);
    await user.save();

    return res.status(201).json({
      newUser,
    });
  } catch (error) {
    next(error);
  }
};

export { register };
