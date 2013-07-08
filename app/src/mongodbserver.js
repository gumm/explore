var mongo = require('mongodb');

/**
 * Create a new mongodb server instance.
 * @constructor
 */
var ExploreMongoDB = function() {
    var server = new mongo.Server('localhost', 27017, {auto_reconnect: true});

    this.BSON = mongo.BSONPure;
    this.db = new mongo.Db('explore', server, {safe: true});

    this.initServer();
};

ExploreMongoDB.prototype.initServer = function() {
    var db = this.db;

    // Do this when the open callback gives an error.
    var errorCallback = (function(err, collection) {
        if (err) {
            console.log("The 'customers' collection doesn't exist. " +
                'Creating it with sample data...', err);
        }
    }).bind(this);

    // Do this when opening the db
    var openCallback = (function(err, db) {
        if (!err) {
            console.log("Connected to 'explore' database");
//            db.collection('customers', {strict: true}, errorCallback);
        }
    }).bind(this);

    db.open(openCallback);
};

module.exports = ExploreMongoDB;
