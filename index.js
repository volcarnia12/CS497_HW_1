import express from 'express';
import logger from 'morgan';
import * as fs from 'fs';
import {v4 as uuidv4} from 'uuid';

const app = express();
const port = 3000;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let userJSON = { table: [] };
let postsJSON = { table: [] };
let commentsJSON = { table: [] };


app.post('/api/user/create', (req, res) => {
    const { name } = req.body;
    let content = "";
    let userId = uuidv4();
  
    if (name === undefined) {
      res.status(400).json({
        message: 'Missing name'
      });
      return;
    }
    else if (name.length > 64){
        res.status(400).json({
            message: 'Name exceeds 64 characters'
        });
        return;
    }

    let user = { userid: userId, name};
    fs.readFile('users.json', 'utf8', function(err, data){
      console.log(data);
      content = JSON.parse(data);
      content.table.push(user);
      userJSON = content;
      fs.writeFile('users.json', JSON.stringify(userJSON), function(err) {
        if (err) throw err;
        console.log('complete');
        });
    });

    res.json(user);
});


app.post('/api/posts/create', (req, res) => {
    const { userid, content } = req.body;
    let postId = uuidv4();
  
    if (content === undefined || userid === undefined) {
      res.status(400).json({
        message: 'Missing content and/or userid'
      });
      return;
    }
    else if (content.length > 128){
        res.status(400).json({
            message: 'Name exceeds 128 characters'
        });
        return;
    }
    let post = {};

    fs.readFile('users.json', 'utf8', function(err, data1){
      let contentPost = JSON.parse(data1);
      const user = contentPost.table.find((user) => user.userid == userid);
      if (user === undefined){
        res.status(404).json({
          message: 'User does not exist'
        });
        return;
      }
      post = { postid: postId, userid: userid, name: user.name, content: content };
      fs.readFile('posts.json', 'utf8', function(err, data2){
        let postContent = JSON.parse(data2);
        postContent.table.push(post);
        postsJSON = postContent;
        fs.writeFile('posts.json', JSON.stringify(postsJSON), function(err) {
          if (err) throw err;
          console.log('complete');
        });
      });
      res.json(post);
      return;
    });
});


app.post('/api/comments/create', (req, res) => {
  const { userid, postid, content } = req.body;
  let commentId = uuidv4();

  if (content === undefined || userid === undefined || postid === undefined) {
    res.status(400).json({
      message: 'Missing content, userid, and/or postid'
    });
    return;
  }
  else if (content.length > 128){
      res.status(400).json({
          message: 'Name exceeds 128 characters'
      });
      return;
  }

  let comment = {};
  fs.readFile('users.json', 'utf8', function(err, data1){
    let userContent = JSON.parse(data1);
    const user = userContent.table.find((user) => user.userid == userid);
    if (user === undefined){
      res.status(404).json({
        message: 'User does not exist'
      });
      return;
    }
    fs.readFile('posts.json', 'utf8', function(err, data2){
      let postContent = JSON.parse(data2);
      const posts = postContent.table.find((post) => post.postid == postid);
      if (posts === undefined){
        res.status(404).json({
          message: 'Post does not exist'
        });
        return;
      }
      comment = { commentid: commentId, postid: postid, userid: userid, name: posts.name, content: content };
      fs.readFile('comments.json', 'utf8', function(err, data3){
        let commentContent = JSON.parse(data3);
        commentContent.table.push(comment);
        commentsJSON = commentContent;
        fs.writeFile('comments.json', JSON.stringify(commentsJSON), function(err) {
          if (err) throw err;
          console.log('complete');
        });
        res.json(comment);
        return;
      });
    });
  });
});


app.get('/api/comments/get', (req, res) => {
  const { commentid } = req.body;

  if (commentid === undefined){
    res.status(400).json({
      message: 'Missing commentid'
    });
    return;
  }
  let getComment = {};
  fs.readFile('comments.json', 'utf8', function(err, data1){
    let commentContent = JSON.parse(data1);
    const comment = commentContent.table.find((comment) => comment.commentid == commentid);
    if ( comment === undefined){
      res.status(404).json({
        message: 'Comment does not exist'
      });
      return;
    }
    getComment = { commentid: commentid, postid: comment.postid, userid: comment.userid, name: comment.name, content: comment.content };
    res.json(getComment);
    return;
  });
});


// 3 Additional Routes //


app.delete('/api/comments/delete', (req, res) => {
  const { commentid } = req.body;

  if (commentid === undefined){
    res.status(400).json({
      message: 'Missing commentid'
    });
    return;
  }
  let getComment = {};
  fs.readFile('comments.json', 'utf8', function(err, data1){
    let commentContent = JSON.parse(data1);
    const comment = commentContent.table.find((comment) => comment.commentid == commentid);
    if ( comment === undefined){
      res.status(404).json({
        message: 'Comment does not exist'
      });
      return;
    }
    let newComment = commentContent.table.filter(object => {
      return object.commentid !== commentid;
    });
    commentsJSON.table = newComment;
    getComment = { commentid: commentid, postid: comment.postid, userid: comment.userid, name: comment.name, content: comment.content };
    fs.writeFile('comments.json', JSON.stringify(commentsJSON), function(err) {
      if (err) throw err;
      console.log('complete');
    });
    res.json(getComment);
    return;
  });
});


app.delete('/api/posts/delete', (req, res) => {
  const { postid } = req.body;

  if (postid === undefined){
    res.status(400).json({
      message: 'Missing postid'
    });
    return;
  }
  let getPost = {};
  fs.readFile('posts.json', 'utf8', function(err, data1){
    let postsContent = JSON.parse(data1);
    const post = postsContent.table.find((post) => post.postid == postid);
    if ( post === undefined){
      res.status(404).json({
        message: 'Post does not exist'
      });
      return;
    }
    let newPost = postsContent.table.filter(object => {
      return object.postid !== postid;
    });
    postsJSON.table = newPost;
    getPost = { postid: postid, userid: post.userid, name: post.name, content: post.content };
    fs.writeFile('posts.json', JSON.stringify(postsJSON), function(err) {
      if (err) throw err;
      console.log('complete');
    });
    res.json(getPost);
    return;
  });
});


app.delete('/api/user/delete', (req, res) => {
  const { userid } = req.body;

  if (userid === undefined){
    res.status(400).json({
      message: 'Missing userid'
    });
    return;
  }
  let getUser = {};
  fs.readFile('users.json', 'utf8', function(err, data1){
    let usersContent = JSON.parse(data1);
    const user = usersContent.table.find((user) => user.userid == userid);
    if ( user === undefined){
      res.status(404).json({
        message: 'User does not exist'
      });
      return;
    }
    let newUser = usersContent.table.filter(object => {
      return object.userid !== userid;
    });
    userJSON.table = newUser;
    getUser = { userid: userid, name: user.name };
    fs.writeFile('users.json', JSON.stringify(userJSON), function(err) {
      if (err) throw err;
      console.log('complete');
    });
    res.json(getUser);
    return;
  });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });