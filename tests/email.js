
const sgMail = require('@sendgrid/mail');
require('dotenv-extended').load();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//sgMail.setApiKey("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");

const msg = {

  to: 'vtsykunov@hotmail.com',

  from: 'Viktor Tsykunov <vtsykunov@yandex.ru>',

  subject: 'Sending with SendGrid is Fun',

  text: 'and easy to do anywhere, even with Node.js',

  html: '<strong>and easy to do anywhere, even with Node.js</strong>',

};

sgMail.send(msg);
