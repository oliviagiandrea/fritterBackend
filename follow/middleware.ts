import type {Request, Response, NextFunction} from 'express';
import FollowCollection from './collection';
import UserCollection from '../user/collection';

/**
 * Checks whether a user passed in via req.body with userId === followeeId exists
 */
 const isBodyFolloweeExists = async (req: Request, res: Response, next: NextFunction) => {
	if (!req.body.followee) {
	  res.status(400).json({
		error: 'Username of followee must be nonempty.'
	  });
	  return;
	}
	const user = await UserCollection.findOneByUsername(req.body.followee as string);
	if (!user) {
	  res.status(404).json({
		error: `A user with username ${req.body.followee as string} does not exist.`
	  });
	  return;
	}
  
	next();
};

/**
 * Checks whether a user passed in via req.params with userId === followeeId exists
 */
 const isParamsFolloweeExists = async (req: Request, res: Response, next: NextFunction) => {
	if (!req.params.followee) {
	  res.status(400).json({
		error: 'Username of followee must be nonempty.'
	  });
	  return;
	}
	const user = await UserCollection.findOneByUsername(req.params.followee as string);
	if (!user) {
	  res.status(404).json({
		error: `A user with username ${req.params.followee as string} does not exist.`
	  });
	  return;
	}
  
	next();
};

/**
 * Checks if a user with userId as followee id in req.body can be followed by the user
 */
 const isFolloweeFollowable = async (req: Request, res: Response, next: NextFunction) => {
	const followee = await UserCollection.findOneByUsername(req.body.followee as string);
	if (followee._id.toString() === req.session.userId.toString()) {
		res.status(409).json({
			error: `User cannot follow themselves.`
		});
		return;
	}
	const follow = await FollowCollection.findOne(req.session.userId, followee._id);
	if (follow) {
		res.status(409).json({
			error: `User is already following ${req.body.followee as string}.`
		});
		return;
	}
  
	next();
};

/**
 * Checks if a user with userId as followee id in req.params can be unfollowed by the user
 */
 const isFolloweeUnfollowable = async (req: Request, res: Response, next: NextFunction) => {
	const followee = await UserCollection.findOneByUsername(req.params.followee as string);
	if (followee._id.toString() === req.session.userId.toString()) {
		res.status(409).json({
			error: `The user cannot unfollow themselves.`
		});
		return;
	}
	
	const follow = await FollowCollection.findOne(req.session.userId, followee._id);
	if (!follow) {
		res.status(409).json({
			error: `The user is already not following ${req.params.followee as string}.`
		});
		return;
	}
  
	next();
};

export {
	isBodyFolloweeExists,
  isParamsFolloweeExists,
	isFolloweeFollowable,
	isFolloweeUnfollowable,
}
