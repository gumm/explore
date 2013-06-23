var crypto = require('crypto');
var MongoDB = require('mongodb').Db;
var Server = require('mongodb').Server;
var moment = require('moment');

var dbPort = 27017;
var dbHost = 'localhost';
var dbName = 'explore';

/* establish the database connection */
var db = new MongoDB(
    dbName,
    new Server(dbHost, dbPort, {auto_reconnect: true}),
    {w: 1}
);
db.open(function(e, d) {
    if (e) {
        console.log(e);
    } else {
        console.log('connected to database :: ' + dbName);
    }
});
var accounts = db.collection('accounts');

/* login validation methods */

exports.autoLogin = function(user, pass, callback) {
    accounts.findOne({user: user}, function(e, o) {
        if (o && o.pass === pass) {
            callback(o);
        } else {
            callback(null);
        }
    });
};

exports.manualLogin = function(user, pass, callback) {
    var error = {
        user: null,
        pass: null
    };
    accounts.findOne({user: user}, function(e, o) {
        if (o === null) {
            error.user = 'User not found';
            callback(error);
        } else {
            validatePassword(pass, o.pass, function(err, res) {
                if (!res) {
                    error.pass = 'User password mismatch';
                    callback(error);
                } else {
                    callback(null, o);
                }
            });
        }
    });
};

/* record insertion, update & deletion methods */

exports.addNewAccount = function(newData, callback) {
    var error = {
        user: null,
        email: null
    };
    accounts.findOne({user: newData.user}, function(e, o) {
        if (o) {
            error.user = 'This username is not available';
            callback(error);
        } else {
            accounts.findOne({email: newData.email}, function(e, o) {
                if (o) {
                    error.email = 'This email is already registered';
                    callback(error);
                } else {
                    saltAndHash(newData.pass, function(hash) {
                        newData.pass = hash;
                        // append date stamp when record was created //
                        newData.date = moment().format(
                            'MMMM Do YYYY, h:mm:ss a'
                        );
                        accounts.insert(newData, {safe: true}, callback);
                    });
                }
            });
        }
    });
};

exports.updateAccount = function(newData, callback) {
    accounts.findOne({user: newData.user}, function(e, o) {
        o.name = newData.name;
        o.email = newData.email;
        o.country = newData.country;
        if (newData.pass === '') {
            accounts.save(o, {safe: true}, callback);
        } else {
            saltAndHash(newData.pass, function(hash) {
                o.pass = hash;
                accounts.save(o, {safe: true}, callback);
            });
        }
    });
};

exports.updatePassword = function(email, newPass, callback) {
    accounts.findOne({email: email}, function(e, o) {
        if (e) {
            callback(e, null);
        } else {
            saltAndHash(newPass, function(hash) {
                o.pass = hash;
                accounts.save(o, {safe: true}, callback);
            });
        }
    });
};

/* account lookup methods */

exports.deleteAccount = function(id, callback) {
    accounts.remove({_id: getObjectId(id)}, callback);
};

exports.getAccountByEmail = function(email, callback) {
    var error = {
        email: null
    };
    accounts.findOne({email: email}, function(e, account) {
        if (account === null) {
            error.email = 'User not found';
            callback(error, null);
        } else {
            callback(null, account);
        }
    });
};

exports.validateResetLink = function(email, passHash, callback) {
    accounts.find({ $and: [
        {email: email, pass: passHash}
    ] }, function(e, o) {
        callback(o ? 'ok' : null);
    });
};

exports.getAllRecords = function(callback) {
    var whenFound = function(e, res) {
        if (e) {
            callback(e);
        } else {
            callback(null, res);
        }
    };
    accounts.find().toArray(whenFound);
};

exports.delAllRecords = function(callback) {
    accounts.remove({}, callback); // reset accounts collection for testing //
};

/* private encryption & validation methods */

var generateSalt = function() {
    var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPURSTUVWXYZ';
    var salt = '';
    for (var i = 0; i < 10; i++) {
        var p = Math.floor(Math.random() * set.length);
        salt += set[p];
    }
    return salt;
};

var md5 = function(str) {
    return crypto.createHash('md5').update(str).digest('hex');
};

var saltAndHash = function(pass, callback) {
    var salt = generateSalt();
    callback(salt + md5(pass + salt));
};

var validatePassword = function(plainPass, hashedPass, callback) {
    var salt = hashedPass.substr(0, 10);
    var validHash = salt + md5(plainPass + salt);
    callback(null, hashedPass === validHash);
};

/* auxiliary methods */

var getObjectId = function(id) {
    return accounts.db.bson_serializer.ObjectID.createFromHexString(id);
};

var findById = function(id, callback) {
    accounts.findOne({_id: getObjectId(id)},
        function(e, res) {
            if (e) {
                callback(e);
            } else {
                callback(null, res);
            }
        });
};


var findByMultipleFields = function(a, callback) {
    // this takes an array of name/val pairs to search
    // against {fieldName : 'value'}
    accounts.find({ $or: a }).toArray(
        function(e, results) {
            if (e) {
                callback(e);
            } else {
                callback(null, results);
            }
        });
};
