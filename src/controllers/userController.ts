import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';

import FailError from '../errors/FailError';
import { User } from '../models/User';
import { generateJWT } from '../utils/generateJWT';

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

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!email || !password) throw new FailError('Missing data to send.');
    if (!user) throw new FailError('Error user not found.');

    const validPassword = bcrypt.compareSync(password, user.password);

    if (user.email !== email || !validPassword) throw new FailError('Invalid username/password.');

    const token = await generateJWT(user._id);

    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        nickName: user.nickName,
      },
      token: token,
    });
  } catch (error) {
    next(error);
  }
};

export { register, login };
