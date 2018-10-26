const path = require('path');
const express = require('express');
const db = require('./db');
const { User, Image } = db.models;
const config = require('./config');


const app = express();

module.exports = app;

app.use(require('body-parser').json());


app.use('/dist', express.static(path.join(__dirname, '../dist')));

const index = path.join(__dirname, '../index.html');

app.get('/', (req, res)=> res.sendFile(index));

app.get('/api/users', (req, res, next)=> {
  User.findAll()
    .then( users => res.send(users))
    .catch(next);
});

app.get('/api/images', (req, res, next)=> {
  Image.findAll()
    .then( images => res.send(images))
    .catch(next);
});

app.get('/api/images/:id', (req, res, next)=> {
  Image.findById(req.params.id)
    .then( image => {
      const { data } = image;
      //const regex = /data:image\/(\w+);base64,(.*)/ 
      const extensions = data.split(';')[0].split('/');
      const extension = extensions[extensions.length - 1];
      const body = new Buffer(data.replace(/^data:image\/\w+;base64,/, ''), 'base64');
      res.contentType(`image/${ extension }`);
      res.send(body);
    })
    .catch(next);
});

app.post('/api/images', (req, res, next)=> {
  Image.upload(req.body.data, config.bucket)
    .then( image => res.send(image))
    .catch(next);
});

app.post('/api/users', (req, res, next)=> {
  User.create(req.body)
    .then( user => res.status(201).send(user))
    .catch(next);
});

app.post('/api/users/reset', (req, res, next)=> {
  db.syncAndSeed()
    .then(()=> res.sendStatus(204))
    .catch(next);
});

app.put('/api/users/:id', (req, res, next)=> {
  User.findById(req.params.id)
    .then( user => user.update(req.body))
    .then( user => res.send(user))
    .catch(next);
});

app.delete('/api/users/:id', (req, res, next)=> {
  User.findById(req.params.id)
    .then( user => user.destroy())
    .then( () => res.sendStatus(204))
    .catch(next);
});

app.use((err, req, res, next)=> {
  console.log(err);
  res.status(500).send({ error: err.message });
});
