var routes = require('../routes');

exports.urls = function(app) {
    app.get('/', routes.index);
    app.get('/auto_login', routes.autoLogin);

    // Intro pages
    app.get('/intro', routes.intro);

    // Login
    app.get('/login', routes.login);
    app.post('/login', routes.login);

    // Account Creation
    app.get('/signup', routes.signUp);
    app.post('/signup', routes.signUp);

    // Password Management
    app.get('/lost-password', routes.lostPassword);
    app.post('/lost-password', routes.lostPassword);

    // Reset Password
    app.get('/reset-password', routes.resetPassword);
    app.post('/reset-password', routes.resetPassword);

    // Home Page
    app.get('/home', routes.home);
    app.post('/home', routes.home);

    // Account Editing
    app.get('/profile/edit', routes.editProfile);
    app.post('/profile/edit', routes.editProfile);

    // Password Editing
    app.get('/password/edit', routes.editPassword);
    app.post('/password/edit', routes.editPassword);

    // Delete account
    app.get('/account/delete', routes.deleteAccount);
    app.post('/account/delete', routes.deleteAccount);

    // Print all accounts
    app.get('/accounts', routes.accounts);

    // Catch all else
    app.get('*', routes.four_oh_four);
};
