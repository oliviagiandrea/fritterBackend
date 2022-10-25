import type {HydratedDocument, Types} from 'mongoose';
import type {Follow} from './model';
import FollowModel from './model';

class FollowCollection{
  /**
   * Get a follow with followerId and followeeId.
   *
   * @param {string} followerId - The follower's id
	 * @param {string} followeeId - The followee's id
   * @return {Promise<HydratedDocument<Follow>> | Promise<null>} - the found follow object, if any
   */
   static async findOne(followerId: Types.ObjectId | string, followeeId: Types.ObjectId | string): Promise<HydratedDocument<Follow>> {
		return FollowModel.findOne({followerId: followerId, followeeId: followeeId}).populate(['followerId', 'followeeId']);
  }

  /**
	 * Get all accounts *following* user with followeeId.
	 * 
	 * @param followeeId - the followee id
	 * @returns {Promise<HydratedDocument<Follow>[]>} - a list of accounts following followeeId, if any
	 */
	static async findAllFollowers(followeeId: Types.ObjectId | string): Promise<Array<HydratedDocument<Follow>>> {
		const follows = await FollowModel.find({followeeId: followeeId});
		const followsPopulated = await Promise.all(follows.map((follow) => follow.populate('followerId')));
		return followsPopulated;
	}

	/**
	 * Get all accounts *followed by* user with followeeId.
	 * 
	 * @param followerId - the follower id
	 * @returns {Promise<HydratedDocument<Follow>[]>} - a list of accounts followed by followerId, if any
	 */
	static async findAllFollowees(followerId: Types.ObjectId | string): Promise<Array<HydratedDocument<Follow>>> {
		const follows = await FollowModel.find({followerId: followerId});
		const followsPopulated = await Promise.all(follows.map((follow) => follow.populate('followeeId')));
		return followsPopulated;
	}

	/**
	 * Add a follow (followerId follows followeeId)
	 * 
	 * @param {string} followerId - the id of the follower
	 * @param {string} followeeId - the id of the followee
	 * @returns {Promise<HydratedDocument<Follow>>} - the newly created follow
	 */
	static async addOne(followerId: Types.ObjectId | string, followeeId: Types.ObjectId | string): Promise<HydratedDocument<Follow>> {
		const follow = new FollowModel({
			followerId,
			followeeId,
		});
		await follow.save();
		return follow.populate('followeeId followerId');
	}

  /**
	 * Delete a follow with given followerId and followeeUsername.
	 * 
	 * @param {string} followerId - the id of the follower
	 * @param {string} followeeId - the id of the followee
	 * @returns {PRomise<Boolean>} - true if the follow has been deleted, false otherwise
	 */
	static async deleteOne(followerId: Types.ObjectId | string, followeeId: Types.ObjectId | string): Promise<boolean> {
		const follow = await FollowModel.deleteOne({followerId: followerId, followeeId: followeeId});
		return follow !== null;
	}
}

export default FollowCollection;