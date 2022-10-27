import type {HydratedDocument} from 'mongoose';
import type {Follower, PopulatedFollower} from './model';

// Update this if you add a property to the Follower type!
type FollowerResponse = {
  follower: string;
  followee: string;
};

/**
 * Transform a raw Follower object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Follower>} follower - A populated follower document
 * @returns {FollowerResponse} - The follower object formatted for the frontend
 */
const constructFollowerResponse = (
  follower: HydratedDocument<Follower>
): FollowerResponse => {
  const followerCopy: PopulatedFollower = {
    ...follower.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const followerUsername = followerCopy._id.follower.username;
  const followeeUsername = followerCopy._id.followee.username;
  return {
    follower: followerUsername,
    followee: followeeUsername
  };
};

export {constructFollowerResponse};
