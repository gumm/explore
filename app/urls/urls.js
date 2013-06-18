var routes = require('../routes');
//var customers = require('../routes/api/customers');

exports.urls = function(app) {
    app.get('/', routes.index);
    app.get('/auto_login', routes.autoLogin);

    // Intro pages
    app.get('/intro', routes.intro);

    // Login
    app.get('/login', routes.login);
    app.post('/login', routes.postLogin);

    // Account Creation
    app.get('/signup', routes.signUp);
    app.post('/signup', routes.postSignUp);

    // Password Management
    app.get('/lost-password', routes.lostPassword);
    app.post('/lost-password', routes.postLostPassword);

    // Home Page
    app.get('/home', routes.home);
    app.post('/home', routes.postHome);

    // Account Editing
    app.get('/home/edit', routes.editAccount);
    app.post('/home/edit', routes.postSignUp);

    // Print all accounts
    app.get('/accounts', routes.accounts);
    app.get('*', routes.four_oh_four);
};
