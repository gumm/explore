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

    // Print all accounts
    app.get('/accounts', routes.accounts);

    app.get('*', routes.four_oh_four);


//    app.get('/api/customers', customers.findAll);
//    app.get('/api/customers/:id', customers.findById);
//    app.post('/api/customers', customers.addCustomer);
//    app.put('/api/customers/:id', customers.updateCustomer);
//    app['delete']('/api/customers/:id', customers.deleteCustomer);
};