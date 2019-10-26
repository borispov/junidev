const { UserModel } = require('./users.model');
const mailer = require('./mailer');
const emailTemplate = require('./emailTemplate');
const logger = require('../../utils/logger');

class UserService {
  constructor(){
  }

  sendFeedbackToEmail = async ({ name, email, text }) => {

    const content = emailTemplate(name, email, text);

    try {
      await this.subscribeUser(email);
      const response = mailer(content, "Feedback Received! Junidev.io")
      logger.info("SENT:: Email Feedback from user: ", name)
      return response
    } catch(e) {
      logger.error('Error inside:: sendFeedbackToEmail')
      return e;
    }

  }

  subscribeUser = async (email, src) => {

    const maybeUser = await UserModel.findOne({ email });
    if (maybeUser !== null) {
      return null
    }
    const user = new UserModel({ email, src })

    try {
      const newUser = await user.save();
      logger.info("Adding a new User. SOURCE: ", src);
      return newUser
    } catch(e){
      logger.error('Error inside:: sub user')
      return e;
    }


  }

}

module.exports = UserService;
