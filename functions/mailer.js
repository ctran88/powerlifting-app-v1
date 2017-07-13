'use strict';

const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

// Configure the email transport using the default SMTP transport and a GMail account.
// For Gmail, enable these:
// 1. https://www.google.com/settings/security/lesssecureapps
// 2. https://accounts.google.com/DisplayUnlockCaptcha
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword
  }
});

// Your company name to include in the emails
// TODO: Change this to your app or company name to customize the email sent.
const APP_NAME = 'The Powerlifting Notebook';

/**
 * Sends an invitation email to a client from a coach.
 *
 * @param      {Object}  event   The event
 * @return     {Object}  Object that is able to send mail
 */
exports.handler = (event) => {
  const data = event.data.val(); // The data retrieved.

  const link = data.link; // The uuid invitation link.
  const email = data.clientEmail; // The client's email.
  const client = data.client; // The name of the client.
  const coach = data.coach; // The name of the coach.
  const team = data.team; // The name of the coach's team.

  return sendInviteEmail(email, client, coach, team, link);
};


/**
 * Sends an invite email.
 *
 * @param      {string}  email   The email
 * @param      {string}  client  The client
 * @param      {string}  coach   The coach
 * @param      {string}  team    The team
 * @param      {string}  link    The link
 * @return     {Object}  Object that is able to send mail
 */
function sendInviteEmail(email, client, coach, team, link) {
  const mailOptions = {
    from: `${APP_NAME} <noreply@the-powerlifting-notebook.firebaseapp.com>`,
    to: email,
    subject: `Invitation to ${APP_NAME}!`,
    text: `Hey ${client || ''}!\n\n` +
          `${'Coach ' + coach + ' has' || 'We have'} invited you to join ${team + ' at' || ''} ${APP_NAME} as their client. ` +
          'Follow this link to create an account with us:\n\n' +
          `https://the-powerlifting-notebook.firebaseapp.com/invitation/${link}\n\n` +
          'If you don\'t want to join, you can just ignore this email.\n\n' +
          'Thanks,\n' +
          `${APP_NAME} Team`,
    html: `Hey ${client || ''}!<br /><br />` +
          `${'Coach ' + coach + ' has' || 'We have'} invited you to join ${team + ' at' || ''} ${APP_NAME} as their client. ` +
          'Follow this link to create an account with us:<br /><br />' +
          `<a href='https://the-powerlifting-notebook.firebaseapp.com/invitation/${link}'>Join us at ${APP_NAME}!</a><br /><br />` +
          'If you don\'t want to join, you can just ignore this email.<br /><br />' +
          'Thanks,<br />' +
          `${APP_NAME} Team`
  };

  return mailTransport.sendMail(mailOptions)
    .then((info) => {
      console.log('Message %s sent: %s', info.messageId, info.response);
    })
    .catch((error) => {
      return console.log('Mailer error: ', error);
    });
}
