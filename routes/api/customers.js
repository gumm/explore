exports.findById = function(req, res) {
    var mongo = req.app.get('mongo');

    var id = req.params.id;
    console.log('Retrieving customer: ' + id);
    mongo.db.collection('customers', function(err, collection) {
        collection.findOne({'_id':new mongo.BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    var mongo = req.app.get('mongo');
    mongo.db.collection('customers', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addCustomer = function(req, res) {
    var mongo = req.app.get('mongo');
    var customer = req.body;
    console.log(req.body);
    console.log('Adding customer: ' + JSON.stringify(customer));
    mongo.db.collection('customers', function(err, collection) {
        collection.insert(customer, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
};

exports.updateCustomer = function(req, res) {
    var mongo = req.app.get('mongo');
    var id = req.params.id;
    var customer = req.body;
    delete customer._id;
    console.log('Updating customer: ' + id);
    console.log(JSON.stringify(customer));
    mongo.db.collection('customers', function(err, collection) {
        collection.update({'_id':new mongo.BSON.ObjectID(id)}, customer, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating customer: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(customer);
            }
        });
    });
};

exports.deleteCustomer = function(req, res) {
    var mongo = req.app.get('mongo');
    var id = req.params.id;
    console.log('Deleting customer: ' + id);
    mongo.db.collection('customers', function(err, collection) {
        collection.remove({'_id':new mongo.BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
};