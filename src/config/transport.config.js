const nodemailer = require('nodemailer');

const smtpTransport = nodemailer.createTransport({
  service: process.env.TRANSPORT_SERVICE,
  host: process.env.TRANSPORT_HOST,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD
  }
});

module.exports = smtpTransport;
