const express = require('express');
const Router = express.Router();
const { isEmail } = require('../../utils/validation').validator;

// retrieve a single job post
Router.post('/users/signup', async (req, res, next) => {

  const { email } = req.body;
  if (!email || !isEmail(email)) {
    return res.render('post', { error: "Please, Enter a valid email address." })
  }
  return res.render('post', { message: 'OK' })
});

Router.get('/users/signup', async (req, res, next) => {
  const message = `Sign up to be the <span class="font-bold text-indigo-700">first</span> to know when this feature available.`
  res.render('post', { message });
})

module.exports = Router;
