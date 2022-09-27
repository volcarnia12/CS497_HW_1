import express from 'express';
import logger from 'morgan';
import * as db from './db.js';
import * as fs from 'fs';
import {v4 as uuidv4} from 'uuid';

const app = express();
const port = 3000;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//const userJSON = 'users.json';
let userJSON = { table: [] };
//const postsJSON = 'posts.json';
let postsJSON = { table: [] };
const commentsJSON = 'comments.json';

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
  
    if (content === undefined) {
      res.status(400).json({
        message: 'Missing content'
      });
      return;
    }
    else if (content.length > 128){
        res.status(400).json({
            message: 'Name exceeds 128 characters'
        });
        return;
    }
    else if (userid === undefined){
        res.status(404).json({
            message: 'User does not exist'
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
      post = { postid: postId, userid, name: user.name, content };
      fs.readFile('posts.json', 'utf8', function(err, data2){
        //console.log(data); 
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
    //const post = db.savePost(userid, content);
    //res.json(post);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });