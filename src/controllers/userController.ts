import fs from 'fs';
import path from 'path';

import bcrypt, { hashSync } from 'bcrypt';
import { NextFunction, Request, Response } from 'express';

import FailError from '../errors/FailError';

import { generateJWT } from '../utils/generateJWT';
import { getLimit, getSkip } from '../utils/controllers/utils';
import { followThisUser, followUserIds } from '../utils/followUserIds';

import PaginatedResponse from '../models/responses/PaginatedResponse';
import { Follow } from '../models/Follow';
import { Publication } from '../models/Publication';
import { IUser, User } from '../models/User';

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

const findAllUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let user = [];

    const limit = getLimit(req);
    const skip = getSkip(req);

    user = await User.find().skip(skip).limit(limit).select('-password -email -role -__v');
    const count = await User.count();

    const followUser = await followUserIds(req.user.id);

    const responseData = {
      data: new PaginatedResponse<IUser>(user, skip, limit, count),
      userFollowMe: followUser.following,
      userFollowing: followUser.following,
    };

    res.status(200).send(responseData);
  } catch (error) {
    next(error);
  }
};

const findOneUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select({ password: 0, role: 0 });
    if (!user) throw new FailError('User not found.');

    const followInfo = await followThisUser(req.user.id, id);

    return res.status(200).json({
      user: user,
      following: followInfo.following,
      follower: followInfo.follower,
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user;

    delete userId.iat;
    delete userId.exp;

    const data = req.body as IUser;
    if (data.password) {
      const hashPassword = hashSync(data.password, 10);
      data.password = hashPassword;
    }

    const user = await User.findById(userId.id);
    const existUser = await User.find({
      $or: [{ email: data.email.toLowerCase() }, { nickName: data.nickName.toLowerCase() }],
    });

    if (!user) throw new FailError('Error user not found.');
    if (existUser && existUser.length >= 1) throw new FailError('User already exists.');

    Object.assign(user, data);
    await User.findByIdAndUpdate(userId.id, user);

    return res.status(200).json({
      user,
    });
  } catch (error) {
    next(error);
  }
};

const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) throw new FailError('The request does not include the image.');

    const image = req.file.originalname;
    const imageSplit = image.split('.');
    const extension = imageSplit[1];

    if (extension !== 'png' && extension !== 'jpg' && extension !== 'jpeg' && extension !== 'gif') {
      const filePath = req.file.path;
      fs.unlinkSync(filePath);
      return res.status(400).json({
        status: 'error',
        message: 'Incorrect file extension',
      });
    }
    const userUpdate = await User.findOneAndUpdate({ _id: req.user.id }, { image: req.file.filename });
    if (!userUpdate) throw new FailError('Error uploading file');

    return res.status(200).json({
      user: userUpdate,
      file: req.file,
    });
  } catch (error) {
    next(error);
  }
};

const avatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { file } = req.params;

    const filePath = './src/uploads/avatars/' + file;

    fs.stat(filePath, (error, exist) => {
      if (!exist) {
        return res.status(404).json({
          message: 'The image does not exist',
        });
      }

      return res.status(200).sendFile(path.resolve(filePath));
    });
  } catch (error) {
    next(error);
  }
};

const counters = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { userId } = req.user;

    if (req.params.id) {
      userId = req.params.id;
    }

    const following = await Follow.count({ user: userId });
    const followed = await Follow.count({ followed: userId });
    const publications = await Publication.count({ user: userId });

    return res.status(200).json({
      userId,
      following: following,
      followed: followed,
      publications: publications,
    });
  } catch (error) {
    next(error);
  }
};

export { register, login, findOneUser, findAllUser, updateUser, uploadImage, avatar, counters };
