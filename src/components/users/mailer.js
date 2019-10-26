const nodemailer = require('nodemailer');
const fs = require('fs');
const { sender, to } = require('./config');

module.exports = async (content, subject) => {

  const receipient = to
  const transporter = nodemailer.createTransport({
        service: "Gmail",
        host: 'smtp.gmail.com',
        auth: sender.auth
    });

  const mailOptions = {
    from: 'Junidev.io',
    to,
    subject,
    text: "Text Message from Junidev.io: ",
    html: content
  }

  const info = await transporter.sendMail(mailOptions);
  console.log('SUCCESS')
  transporter.close();

  return info
}
