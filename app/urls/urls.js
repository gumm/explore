var routes = require('../routes');
//var customers = require('../routes/api/customers');

exports.urls = function(app) {
    app.get('/', routes.index);
    app.get('/login', routes.login);
    app.post('/login', routes.postLogin);


//    app.get('/signup', routes.signUp);
//    app.post('/signup', routes.postSignUp);


//    app.get('/api/customers', customers.findAll);
//    app.get('/api/customers/:id', customers.findById);
//    app.post('/api/customers', customers.addCustomer);
//    app.put('/api/customers/:id', customers.updateCustomer);
//    app['delete']('/api/customers/:id', customers.deleteCustomer);
};