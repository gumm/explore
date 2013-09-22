goog.provide('exp.EmailDispatcher');

goog.require('exp.emailSettings');

/**
 * @constructor
 */
exp.EmailDispatcher = function() {
  this.server_ = require('emailjs/email').server.connect({
    host: exp.emailSettings.HOST,
    user: exp.emailSettings.USER,
    password: exp.emailSettings.PW,
    ssl: true
  });
};

exp.EmailDispatcher.prototype.dispatchResetPasswordLink = function(account, callback) {
  this.server_.send({
    from: exp.emailSettings.SENDER,
    to: account.profile.email,
    subject: 'Password Reset',
    text: 'something went wrong... :(',
    attachment: this.composeEmail_(account)
  }, callback);
};

exp.EmailDispatcher.prototype.composeEmail_ = function(account) {
  var target = 'http://localhost:3000/';
  var link = target + 'reset-password?e=' + account.profile.email +
    '&p=' + account.credentials.tpass;
  var html = '<html><body>';
  html += 'Hi ' + account.profile.name + ',<br><br>';
  html += 'Your username is :: <b>' + account.credentials.user + '</b><br><br>';
  html += '<a href="' + link + '">Please click here to reset your password' +
    '</a><br><br>';
  html += 'Cheers,<br>';
  html += '<a href="' + target + '">Explore</a><br><br>';
  html += '</body></html>';
  return [
    {data: html, alternative: true}
  ];
};