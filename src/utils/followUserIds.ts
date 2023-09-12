import FailError from '../errors/FailError';
import { Follow } from '../models/Follow';

const followUserIds = async (identityUserId: string) => {
  try {
    const following = await Follow.find({ user: identityUserId }).select({
      _id: 0,
      __v: 0,
      user: 0,
      updateAt: 0,
      deleted: 0,
    });

    const follower = await Follow.find({ followed: identityUserId }).select({
      _id: 0,
      __v: 0,
      followed: 0,
      updateAt: 0,
      deleted: 0,
    });

    const followingClean: string[] = [];
    following.forEach((follow) => {
      followingClean.push(String(follow.followed));
    });
    const followersClean: string[] = [];
    follower.forEach((follow) => {
      followersClean.push(String(follow.user));
    });

    return {
      following: followingClean,
      followers: followersClean,
    };
  } catch (error) {
    throw new FailError('Error when performing the search.');
  }
};

const followThisUser = async (identityUserId: string, profileUserId: string) => {
  try {
    const following = await Follow.findOne({ user: identityUserId, followed: profileUserId });

    const follower = await Follow.findOne({ user: profileUserId, followed: identityUserId });
    return {
      following,
      follower,
    };
  } catch (error) {
    throw new FailError('Error when performing the search.');
  }
};

export { followUserIds, followThisUser };
