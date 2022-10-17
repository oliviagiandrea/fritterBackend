/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properties 'username' and 'password'
 */

 function viewAllBookmarks(fields) {
  fetch('/api/bookmarks')
    .then(showResponse)
    .catch(showResponse);
}

function viewBookmarksByUsername(fields) {
  fetch(`/api/bookmarks?username=${fields.username}`)
    .then(showResponse)
    .catch(showResponse);
}

function createBookmark(fields) {
  fetch('/api/bookmarks', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function deleteBookmark(fields) {
  fetch(`/api/bookmarks/${fields.id}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}