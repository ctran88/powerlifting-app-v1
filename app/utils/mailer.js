'use strict';

// var nodemailer = require('nodemailer');

module.exports = {
    /**
     * Sends an mail.
     *
     * @param      {Object}  params  The parameters
     */
  sendMail: function(params) {
        // // create reusable transporter object using the default SMTP transport
        // var transporter = nodemailer.createTransport({
        //     service: 'Gmail',
        //     auth: {
        //         user: process.env.EMAIL,
        //         pass: process.env.PASS
        //     }
        // });

        // // setup email data with unicode symbols
        // var mailOptions = {
        //     from: process.env.EMAIL, // sender address
        //     to: params.to, // list of receivers
        //     subject: params.subject, // Subject line
        //     text: params.text, // plain text body
        //     html: params.html // html body
        // };

        // // send mail with defined transport object
        // transporter.sendMail(mailOptions, (error, info) => {
        //     if (error) {
        //         return console.log(error);
        //     }
        //     console.log('Message %s sent: %s', info.messageId, info.response);
        // });
  }
};
