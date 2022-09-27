const users = [];
const comments = [];

let userId = 0;
let commentId = 0;

export const saveUser = (name) => {
  let user = { id: userId, name };
  users[userId] = user;
  userId++;
  return user;
};

export const getPost = (postId) => {
  if (posts[postId] === undefined) {
    return null;
  }

  return posts[postId];
};

export const getPosts = () => {
  return posts;
};

export const saveComment = (postId, body) => {
  let comment = { id: commentId, postId, body };

  if (posts[postId] === undefined) {
    return null;
  }

  comments[commentId] = comment;
  commentId++;
  return comment;
};

export const getComment = (commentId) => {
  if (comments[commentId] === undefined) {
    return null;
  }

  return comments[commentId];
};

export const getComments = (postId) => {
  if (posts[postId] === undefined) {
    return null;
  }

  const postComments = comments.filter(v => v.postId === postId);

  return postComments;
};