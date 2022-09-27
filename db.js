import * as fs from 'fs';

//const users = [];
//const posts = [];

let userId = 0;
let postId = 0;

let users = [];
let posts = [];
let comments = [];

const JSONfile = 'users.json';
const JSONfile2 = 'posts.json';
const JSONfile3 = 'comments.json';

//const fs = require('fs');

export const saveUser = (name) => {
  console.log(userId);
  
  //const users = JSON.parse(JSONfile);
  /*if (undefined === JSON.parse(JSONfile)){
    user = { userid: 0, name };
  }
  else{
    userId = JSON.parse(JSONfile).length + 1;
    user = { userid: userId, name};
  }*/
  let user = { userid: userId, name };
  users[userId] = user;
  userId++;
  console.log(users);
  return user;
};

export const savePost = (userid, content) => {
  console.log(users);
  let comment = { postid: postId, userid, name: users[userid], content };
  //console.log(users[userid]);
  if (users[userid] === undefined) {
    return undefined;
  }

  posts[postId] = comment;
  console.log(posts);
  postId++;
  return comment;
};

////

export const getPost = (postId) => {
  if (posts[postId] === undefined) {
    return null;
  }

  return posts[postId];
};

export const getPosts = () => {
  return posts;
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