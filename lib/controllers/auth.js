const { Router } = require('express');
const UserService = require('../services/UserService.js');

const oneMsDay = 1000 * 60 * 60 * 48;

module.exports = Router()
  .post('/signup', async (req, res, next) => {
    try {
      const user = await UserService.signUp(req.body);
      console.log(user);
      res.send(user);
    }catch(err){
      err.status = 401;
      next(err);
    }

  })
  .post('/login', async (req, res, next) => {
    try{
      const user = await UserService.login(req.body);
      res.cookie('userId', user.id, {
        httpOnly: true,
        maxAge: oneMsDay
      });
      res.send(user);
    }catch(err){
      err.status = 401;
      next(err);
    }
  });


