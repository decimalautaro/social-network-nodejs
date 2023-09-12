import FailError from '../errors/FailError';
import { Follow, IFollow } from '../models/Follow';

const followUserIds = async (identityUserId: string) => {
  try {
    const following = await Follow.find({ user: identityUserId }).select({
      _id: 0,
      __v: 0,
      user: 0,
      updateAt: 0,
      deleted: 0,
    });

    const followers = await Follow.find({ followed: identityUserId }).select({
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
    followers.forEach((follow) => {
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
const followThisUser = async (identityUserId: string, profileUserId: string) => {};
export { followUserIds, followThisUser };
