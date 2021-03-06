const { Router } = require('express');
const UserService = require('../services/UserService.js');
const ensureAuth = require('../middleware/ensure-auth.js');
const User = require('../models/User.js');

const oneMsDay = 1000 * 60 * 60 * 48;

module.exports = Router()
  .post('/signup', async (req, res, next) => {
    try {
      const user = await UserService.signUp(req.body);
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
      err.status = 400;
      next(err);
    }
  })
  .get('/me', ensureAuth, async (req, res, next) => {
    try{
      const { userId } = req.cookies;
      const user = await User.getMe(userId);
      res.send(user);
    }catch(err){
      next(err);
    }
  });


