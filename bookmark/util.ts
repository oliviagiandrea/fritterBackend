import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Bookmark, PopulatedBookmark} from '../bookmark/model';

type BookmarkResponse = {
  _id: string;
  authorId: string;
  freetId: string;
  dateSaved: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Bookmark object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Bookmark>} bookmark - A bookmark
 * @returns {BookmarkResponse} - The bookmark object formatted for the frontend
 */
const constructBookmarkResponse = (bookmark: HydratedDocument<Bookmark>): BookmarkResponse => {
  const bookmarkCopy: PopulatedBookmark = {
    ...bookmark.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = bookmarkCopy.authorId;
  delete bookmarkCopy.authorId;
  return {
    ...bookmarkCopy,
    _id: bookmarkCopy._id.toString(),
    authorId: username,
    freetId: bookmarkCopy.freetId._id.toString(),
    dateSaved: formatDate(bookmark.dateSaved),
  };
};

export {
  constructBookmarkResponse
};
