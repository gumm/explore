var routes = require('../routes');
var user = require('../routes/user');
var customers = require('../routes/customers');

var urls = urls || {};

urls.configure = function(app) {
    app.get('/', routes.index);
    app.get('/users', user.list);

    app.get('/customers', customers.findAll);
    app.get('/customers/:id', customers.findById);
    app.post('/customers', customers.addCustomer);
    app.put('/customers/:id', customers.updateCustomer);
    app.delete('/customers/:id', customers.deleteCustomer);
};

module.exports = urls;