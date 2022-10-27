import type {HydratedDocument, Types} from 'mongoose';
import type {Bookmark} from './model';
import BookmarkModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore bookmarks
 * stored in MongoDB, including adding, finding, updating, and deleting bookmarks.
 *
 */
class BookmarkCollection {
  /**
   * Bookmark a post
   *
   * @param {string} freetId - The id of the freet being bookmarked
   * @param {string} authorId - The id of the author bookmarking the freet
   * @return {Promise<HydratedDocument<Bookmark>>} - The newly created bookmark
   */
  static async addOne(
    freetId: Types.ObjectId | string,
    authorId: Types.ObjectId | string): Promise<HydratedDocument<Bookmark>> {
    const date = new Date();
    const bookmark = new BookmarkModel({
      freetId,
      authorId,
      dateSaved: date
    });
    await bookmark.save(); // Saves bookmark to MongoDB
    return bookmark.populate('freetId authorId dateSaved');
  }

  /**
   * Find a bookmark by bookmarkId
   *
   * @param {string} bookmarkId - The id of the bookmark to find
   * @return {Promise<HydratedDocument<Bookmark>> | Promise<null> } - The bookmark with the given bookmarkId, if any
   */
  static async findOne(bookmarkId: Types.ObjectId | string): Promise<HydratedDocument<Bookmark>> {
    return BookmarkModel.findOne({_id: bookmarkId}).populate('freetId authorId dateSaved');
  }

  /**
   * Get all the bookmarks in the database
   *
   * @return {Promise<HydratedDocument<Bookmark>[]>} - An array of all of the bookmarks
   */
  static async findAll(): Promise<Array<HydratedDocument<Bookmark>>> {
    // Retrieves bookmarks and sorts them from most to least recent
    return BookmarkModel.find({}).sort({dateSaved: -1}).populate('freetId authorId dateSaved');
  }

  /**
   * Get all the bookmarks by given author
   *
   * @param {string} username - The username of the author that bookmarked the posts
   * @return {Promise<HydratedDocument<Bookmark>[]>} - An array of all of the bookmarks
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Bookmark>>> {
    const author = await UserCollection.findOneByUsername(username);
    return BookmarkModel.find({authorId: author._id}).populate('freetId authorId dateSaved');
  }

  /**
   * Delete a bookmark with given bookmarkId.
   *
   * @param {string} bookmarkId - The bookmarkId of bookmark to delete
   * @return {Promise<Boolean>} - true if the bookmark has been deleted, false otherwise
   */
  static async deleteOne(bookmarkId: Types.ObjectId | string): Promise<boolean> {
    const bookmark = await BookmarkModel.deleteOne({_id: bookmarkId});
    return bookmark !== null;
  }

  /**
   * Delete all the bookmarks by the given author
   *
   * @param {string} authorId - The id of author of bookmarks
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await BookmarkModel.deleteMany({authorId});
  }
}

export default BookmarkCollection;
