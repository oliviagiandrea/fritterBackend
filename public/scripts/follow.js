function follow(fields) {
  fetch(`/api/followers/${fields.followee}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  })
    .then(showResponse)
    .catch(showResponse);
}

function getFollowers(fields) {
  fetch(`/api/followers/${fields.username}`)
    .then(showResponse)
    .catch(showResponse);
}

function unfollow(fields) {
  fetch(`/api/followers/${fields.username}`, { method: "DELETE" })
    .then(showResponse)
    .catch(showResponse);
}