import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import UserCollection from '../user/collection';
import FollowerCollection from './collection';

/**
 * Check that user is a follower
 */
const isFollower = async (req: Request, res: Response, next: NextFunction) => {
  const follower = await FollowerCollection.findOneByUsername(
    req.session.userId,
    req.params.username
  );
  if (!follower) {
    res.status(400).json({
      error: {
        alreadyFollower: `You need to be a follower of ${req.params.username}.`
      }
    });
    return;
  }

  next();
};

/**
 * Check that user is not a follower
 */
const isNotFollower = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const follower = await FollowerCollection.findOneByUsername(
    req.session.userId,
    req.params.username
  );
  if (follower) {
    res.status(400).json({
      error: {
        alreadyFollower: `You are already a follower of ${req.params.username}.`
      }
    });
    return;
  }

  next();
};

const isNotSameUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = await UserCollection.findOneByUsername(req.params.username);
  if (user._id === req.session.userId) {
    res.status(400).json({
      error: {
        alreadyFollower: 'You cannot follow yourself'
      }
    });
    return;
  }

  next();
};

export {isFollower, isNotFollower, isNotSameUser};
