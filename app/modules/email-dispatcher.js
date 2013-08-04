var ES = require('./email-settings');
var EM = {};

EM.server = require('emailjs/email').server.connect({
    host: ES.host,
    user: ES.user,
    password: ES.password,
    ssl: true
});

exports.dispatchResetPasswordLink = function(account, callback) {
    EM.server.send({
        from: ES.sender,
        to: account.profile.email,
        subject: 'Password Reset',
        text: 'something went wrong... :(',
        attachment: EM.composeEmail(account)
    }, callback);
};

EM.composeEmail = function(account) {
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
