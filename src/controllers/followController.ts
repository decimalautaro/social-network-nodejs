import { NextFunction, Request, Response } from 'express';
import FailError from '../errors/FailError';

import { getLimit, getSkip } from '../utils/controllers/utils';
import { followUserIds } from '../utils/followUserIds';

import { User } from '../models/User';
import { Follow, IFollow } from '../models/Follow';
import PaginatedResponse from '../models/responses/PaginatedResponse';

const following = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let userId = req.user.id;
    if (req.params.id) userId = req.params.id;

    const limit = getLimit(req);
    const skip = getSkip(req);

    const following = await Follow.find({ user: userId })
      .populate('user followed', '-password -role -__v ') // segunda "" indico que quiero mostrar o agregando - cuales no deseo mostrar
      .skip(skip)
      .limit(limit)
      .select({ followed: 1, _id: 0 });
    const count = await Follow.count();

    const followUser = await followUserIds(req.user.id);

    const responseData = {
      data: new PaginatedResponse<IFollow>(following, skip, limit, count).data,
      userFollowing: followUser.following,
      userFollowMe: followUser.followers,
    };
    res.status(200).send(responseData);
  } catch (error) {
    next(error);
  }
};

const followed = async (req: Request, res: Response, next: NextFunction) => {
  try {
  } catch (error) {
    next(error);
  }
};

const saveFollow = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { followed } = req.body;

    const identity = req.user;

    const userFollowed = await User.findById(String(followed));

    if (!userFollowed) throw new FailError('User not exists.');

    const userToFollow = new Follow({
      user: identity.id,
      followed: followed,
    });

    if (!userToFollow) throw new FailError('Could not follow user.');

    await userToFollow.save();

    res.status(200).json({ userToFollow });
  } catch (error) {
    next(error);
  }
};

const unFollow = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const existFollow = await Follow.find({ user: userId, followed: id });
    const deletedValue = existFollow[0].deleted;

    if (!existFollow || deletedValue === true) throw new FailError('I did not stop following anyone');

    await Follow.find({ user: userId, followed: id }).updateOne({ deleted: true });

    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export { following, followed, saveFollow, unFollow };
