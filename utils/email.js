const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //create a transpoter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //Define the mail Options
  const mailOptions = {
    from: 'Emma Mwas <emmamwas99@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  //Sending the actual Email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
