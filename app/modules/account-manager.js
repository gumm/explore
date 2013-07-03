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

var makeAccount = function(data) {
    return {
        profile: {
            name: data.name || null,
            email: data.email || null,
            url: data.url || null,
            location: {
                city: data.city || null,
                country: data.country || null
            }
        },
        contact: {
            phone: data.phone || null,
            cell: data.cell || null
        },
        credentials: {
            pass: data.pass || null,
            user: data.user || null

        },
        date: moment().format('MMMM Do YYYY, h:mm:ss a')
    };
};

/* login validation methods */

var autoLogin = function(user, pass, callback) {
    accounts.findOne({'credentials.user': user}, function(err, res) {
        if (res && res.credentials.pass === pass) {
            callback(res);
        } else {
            callback(null);
        }
    });
};

var manualLogin = function(user, pass, callback) {
    var error = {
        user: null,
        pass: null
    };
    accounts.findOne({'credentials.user': user}, function(e, account) {
        if (account === null) {
            error.user = 'User not found';
            callback(error);
        } else {
            validatePassword(pass, account.credentials.pass, function(err, res) {
                if (!res) {
                    error.pass = 'User password mismatch';
                    callback(error);
                } else {
                    callback(null, account);
                }
            });
        }
    });
};

/* record insertion, update & deletion methods */

var addNewAccount = function(data, callback) {
    var error = {
        user: null,
        email: null
    };
    var newAccount = makeAccount(data);
    accounts.findOne({'credentials.user': newAccount.credentials.user},
        function(err, account) {
            if (account) {
                error.user = 'This username is not available';
                callback(error);
            } else {
                accounts.findOne({email: newAccount.profile.email},
                    function(e, o) {
                        if (o) {
                            error.email = 'This email is already registered';
                            callback(error);
                        } else {
                            saltAndHash(newAccount.credentials.pass,
                                function(hash) {
                                    newAccount.credentials.pass = hash;
                                    accounts.insert(newAccount, {safe: true}, callback);
                                }
                            );
                        }
                    }
                );
            }
        }
    );
};

var updateAccount = function(user, newData, callback) {

    // This does not include changing user names or passwords here.
    accounts.findOne({'credentials.user': user}, function(err, result) {
        if (result) {
            result.profile.name = newData.name;
            result.profile.email = newData.email;
            result.contact.country = newData.country;
            accounts.save(result, {safe: true}, callback);
        } else {
            console.log('NO ACCOUNT TO UPDATE:', err);
            callback('Account not found');
        }
    });
};

var updatePassword = function(email, newPass, callback) {
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

var deleteAccount = function(id, callback) {
    accounts.remove({_id: getObjectId(id)}, callback);
};

var getAccountByEmail = function(email, callback) {
    var error = {
        email: null
    };
    accounts.findOne({'profile.email': email}, function(e, account) {
        if (account === null) {
            error.email = 'User not found';
            callback(error, null);
        } else {
            callback(null, account);
        }
    });
};

var getAccountByUser = function(user, callback) {
    var error = {
        user: null
    };
    accounts.findOne({'credentials.user': user}, function(e, account) {
        if (account === null) {
            error.user = 'User not found';
            callback(error, null);
        } else {
            callback(null, account);
        }
    });
};

var validateResetLink = function(email, passHash, callback) {
    accounts.find({ $and: [
        {email: email, pass: passHash}
    ] }, function(e, o) {
        callback(o ? 'ok' : null);
    });
};

var getAllRecords = function(callback) {
    var whenFound = function(e, res) {
        if (e) {
            callback(e);
        } else {
            callback(null, res);
        }
    };
    accounts.find().toArray(whenFound);
};

var delAllRecords = function(callback) {
    accounts.remove({}, callback); // reset accounts collection for testing //
};

module.exports = {
    makeAccount: makeAccount,
    autoLogin: autoLogin,
    manualLogin: manualLogin,
    addNewAccount: addNewAccount,
    updateAccount: updateAccount,
    updatePassword: updatePassword,
    deleteAccount: deleteAccount,
    getAccountByEmail: getAccountByEmail,
    validateResetLink: validateResetLink,
    getAllRecords: getAllRecords,
    delAllRecords: delAllRecords
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
