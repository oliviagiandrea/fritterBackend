import type {Request, Response} from 'express';
import express from 'express';
import FollowerCollection from './collection';
import * as userValidator from '../user/middleware';
import * as followerValidator from './middleware';
import * as util from './util';

const router = express.Router();

router.post(
  '/:username',
  [
    userValidator.isUserLoggedIn,
    userValidator.isUserExists,
    followerValidator.isNotFollower,
    followerValidator.isNotSameUser
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const follower = await FollowerCollection.addOneByUsername(
      userId,
      req.params.username
    );
    res.status(201).json({
      message: 'Success',
      follower: util.constructFollowerResponse(follower)
    });
  }
);

router.delete(
  '/:username',
  [
    userValidator.isUserLoggedIn,
    userValidator.isUserExists,
    followerValidator.isFollower
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    await FollowerCollection.deleteOneByUsername(userId, req.params.username);
    res.status(200).json({
      message: 'Successfully unfollowed'
    });
  }
);

router.get(
  '/:username',
  [userValidator.isUserExists],
  async (req: Request, res: Response) => {
    const followers = await FollowerCollection.findAllByUsername(
      req.params.username
    );
    const response = followers.map(util.constructFollowerResponse);
    res.status(200).json(response);
  }
);

router.get('/', (req: Request, res: Response) => {
  res.status(400).json({
    error: 'Provided username must be nonempty.'
  });
});
router.post('/', (req: Request, res: Response) => {
  res.status(400).json({
    error: 'Provided username must be nonempty.'
  });
});

router.delete('/', (req: Request, res: Response) => {
  res.status(400).json({
    error: 'Provided username must be nonempty.'
  });
});

export {router as followerRouter};
