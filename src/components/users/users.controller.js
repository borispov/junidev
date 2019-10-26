const UserService = require('./users.service');
const logger = require('../../utils/logger');
const { AppError }= require('../../utils/errorHandler');
const { validator } = require('../../utils/validation');

const userService = new UserService();

const feedback = async (req, res, next) => {

  const { name, email, msg } = req.body;

  if (!validator.isLength(name) || !validator.isLength(email) || !validator.isLength(msg)) { 
    return res.render('/home', { error: { type: 'feedback', messge: 'incomplete fields' } });
  }

  try {
    const request = await userService.sendFeedbackToEmail({ name, email, msg });
    logger.info("Sent Request To Database:: ADD FEEDBACK")

    return request && request.response.includes('OK')
      ? res.render('home', { type: 'feedback', message: 'Feedback Sent' })
      : res.render('home', { type: 'feedback', message: 'Something Wwent WWrong.' })
  } catch(e) {
    next(e);
    return res.render('home', { type: 'feedback', message: 'Something Went Wrong.. You are welcomed to approach me personally via boristofu@gmail.com' })
  }
}

const signupPost = async (req, res, next) => {
  logger.info("subscribing a user")
  const { name, email } = req.body;
  const isValid = !validator.isLength(name, 2) || !validation.isEmail(email);
  if (!isValid) {
    logger.info(" OOPS:: USER ALREADY EXISTS ERR")
    return res.render('post', { error: "You probably entered invalid input. Please Correct and Resend." })
  }

  try {
    const response = await userService.subscribeUser(email);
    return response === null 
      ? res.render('post', { error: "User Already Exists" })
      : res.render('post', { message: 'You Are Signed UP!' })
  } catch(err) {
    next(err);
    logger.error(err);
    return res.render('post', { error: "The server is currently unavailable, please try again in a few minutes . . ." })
  }
}

// Just re-render the page with some feedback message POST-Subscription;
const signupGet = async (req, res, next) => {
  const message = `Sign up to be the <span class="font-bold text-indigo-700">first</span> to know when this feature available.`
  res.render('post', { message });
}


module.exports.userController = {
  feedback,
  signupGet,
  signupPost
}
