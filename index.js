import express from 'express';
import logger from 'morgan';
import * as db from './db.js';

const app = express();
const port = 3000;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/api/user/create', (req, res) => {
    const { name } = req.body;
  
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

    const post = db.saveUser(name);
    res.json(post);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });