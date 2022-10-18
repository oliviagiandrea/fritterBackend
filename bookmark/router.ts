import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import BookmarkCollection from './collection';
import * as userValidator from '../user/middleware';
import * as bookmarkValidator from '../bookmark/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the bookmarks
 *
 * @name GET /api/bookmarks
 *
 * @return {BookmarkResponse[]} - A list of all the bookmarks sorted in descending
 *                      order by date saved
 */
/**
 * Get bookmarks by author.
 *
 * @name GET /api/bookmarks?authorId=id
 *
 * @return {BookmarkResponse[]} - An array of bookmarks created by author with id, authorId
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if authorId query parameter was supplied
    if (req.query.authorId !== undefined) {
      next();
      return;
    }

    const allBookmarks = await BookmarkCollection.findAll();
    const response = allBookmarks.map(util.constructBookmarkResponse);
    res.status(200).json(response);
  },
  [
    userValidator.isAuthorExists
  ],
  async (req: Request, res: Response) => {
    const authorBookmarks = await BookmarkCollection.findAllByUsername(req.query.username as string);
    const response = authorBookmarks.map(util.constructBookmarkResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new bookmark.
 *
 * @name POST /api/bookmarks
 *
 * @param {string} freetId - The id of the freet to bookmark
 * @return {BookmarkResponse} - The created bookmark
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the freet does not exist
 * @throws {413} - If the freet content is more than 140 characters long
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    bookmarkValidator.isFreetExists
  ],
  async (req: Request, res: Response) => {
    const authorId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const freetId = (req.body.freetId as string) ?? ''; // Will not be an empty string since its validated in isFreetExists
    const bookmark = await BookmarkCollection.addOne(freetId, authorId);

    res.status(201).json({
      message: 'Your bookmark was created successfully.',
      bookmark: util.constructBookmarkResponse(bookmark)
    });
  }
);

/**
 * Delete a bookmark
 *
 * @name DELETE /api/bookmarks/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the saver of
 *                 the bookmark
 * @throws {404} - If the bookmarkId is not valid
 */
router.delete(
  '/:bookmarkId?',
  [
    userValidator.isUserLoggedIn,
    bookmarkValidator.isBookmarkExists,
  ],
  async (req: Request, res: Response) => {
    await BookmarkCollection.deleteOne(req.params.bookmarkId);
    res.status(200).json({
      message: 'Your bookmark was deleted successfully.'
    });
  }
);

export {router as bookmarkRouter};
