const express = require('express');
const Router = express.Router();
const { userController } = require('./users.controller');


Router.post('/signup', userController.signupPost);

Router.get('/signup', userController.signupGet);

Router.post('/users/feedback', userController.feedback);

module.exports = Router;
