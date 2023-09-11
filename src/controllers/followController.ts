import { NextFunction, Request, Response } from 'express';
import FailError from '../errors/FailError';

import { Follow } from '../models/Follow';

const saveFollow = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { followed } = req.body;

    const identity = req.user;

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

export { saveFollow, unFollow };
