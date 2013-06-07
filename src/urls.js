var routes = require('../routes');
var user = require('../routes/user');
var customers = require('../routes/api/customers');

var Urls = function(app) {
    app.get('/', routes.index);
    app.get('/landing', routes.landing);

    app.get('/users', user.list);

    app.get('/api/customers', customers.findAll);
    app.get('/api/customers/:id', customers.findById);
    app.post('/api/customers', customers.addCustomer);
    app.put('/api/customers/:id', customers.updateCustomer);
    app['delete']('/api/customers/:id', customers.deleteCustomer);
};

module.exports = Urls;