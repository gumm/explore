var crypto = require('crypto');
var MongoDB = require('mongodb').Db;
var BSON = require('mongodb').BSONPure;
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
            surname: data.surname || null,
            email: data.email || null,
            url: data.url || null,
            location: {
                city: data.city || null,
                country: data.country || null
            },
            contact: {
                phone: data.phone || null,
                cell: data.cell || null
            }
        },
        credentials: {
            pass: data.pass || null,
            user: data.user || null
        }
    };
};


/**
 * BEWARE: This passes the account with credentials into the callback.
 * @param user
 * @param pass
 * @param callback
 */
var autoLogin = function(user, pass, callback) {
    accounts.findOne({'credentials.user': user}, function(err, account) {
        if (account && account.credentials.pass === pass) {
            callback(account);
        } else {
            callback(null);
        }
    });
};

/**
 * BEWARE: This passes the account with credentials into the callback.
 * @param user
 * @param pass
 * @param callback
 */
var manualLogin = function(user, pass, callback) {
    var error = {
        user: null,
        pass: null
    };
    accounts.findOne({'credentials.user': user}, function(err, account) {
        if (account === null) {
            error.user = 'User not found';
            callback(error);
        } else {
            validatePassword(pass, account.credentials.pass, function(isValid) {
                if (!isValid) {
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

var addNewAccount = function(newAccount, callback) {
    var error = {
        user: null,
        email: null
    };

    /**
     * Check if the given email is unique. Errors if it is not, else
     * create the account.
     * @param {Object} err An Error object.
     * @param {Object} account The existing account.
     */
    var uniqueEmailCallback = function(err, account) {
        if (account) {
            error.email = 'This email is already registered';
            callback(error);
        } else {
            newAccount.date = moment().format('MMMM Do YYYY, h:mm:ss a');
            convertPwToSaltedHash(
                newAccount,
                newAccount.credentials.pass, // This is still in clear text.
                callback
            );
        }
    };

    /**
     * Checks if the account with the given username already exists.
     * Errors if id does, else go check if the email is unique.
     * @param {Object} err An Error object.
     * @param {Object} account The existing account.
     */
    var uniqueUserCallback = function(err, account) {
        if (account) {
            error.user = 'This username is not available';
            callback(error);
        } else {
            checkUniqueEmail(newAccount.profile.email, uniqueEmailCallback);
        }
    };

    checkUniqueUsername(newAccount.credentials.user, uniqueUserCallback);
};

/**
 * BEWARE: This passes the account with credentials into the callback.
 * This does not include changing user names or passwords here.
 * @param uid
 * @param newData
 * @param callback
 */
var updateProfile = function(uid, newData, callback) {

    var findAndModifyCallback = function(err, account) {
        if (err){
            callback(err); // returns error if no matching object found
        } else {
            callback(null, account);
        }
    };

    accounts.findAndModify(
        {_id: BSON.ObjectID(uid)}, // query
        [['_id','asc']],           // sort order
        {$set: {profile: newData.profile}},
        {new: true}, // options new - if set to true, callback function
                     // returns the modified record.
                     // Default is false (original record is returned)
        findAndModifyCallback
    );
};

var updatePassword = function(uid, passwords, callback) {

    var pass = passwords.currentPass;
    var newPass = passwords.newPass;
    var error = {
        pass: null,
        currpass: null
    };

    accounts.findOne({_id: BSON.ObjectID(uid)}, function(err, account) {
        if (err) {
            error.pass = 'Error getting account to update';
            callback(err);
        } else if(account) {
            // Validate the given current password to stored hash
            validatePassword(pass, account.credentials.pass, function(isValid) {
                if (!isValid) {
                    error.currpass = 'This is not your current password';
                    callback(error);
                } else {
                    saltAndHash(newPass, function(hash) {
                        account.credentials.pass = hash;
                        accounts.save(account, {safe: true}, function() {
                            callback(null, account.profile);
                        });
                    });
                }
            });
        } else {
            error.currpass = 'Could not find the account to update';
            callback(err);
        }
    });
};

/**
 * Seeds the account credentials with a new key: 'tpass', and assign a random,
 * hash as the value. This is used to validate the link sent to the user's
 * email account when a lost password reset email is sent.
 * @param email
 * @param callback
 */
var seedAccountWithResetKey = function(email, callback) {
    getAccountByEmail(email, function(err, account) {
        if(err) {
            callback(err, null);
        } else {
            // Create a simple random number, and salt and hash it.
            var rand = Math.floor(Math.random() * 2147483648).toString(36);
            saltAndHash(rand, function(hash) {
                // Once we have the hash, use it as a temp password.
                account.credentials.tpass = hash;
                accounts.save(account, {safe: true}, function() {
                    callback(null, account);
                });
            });
        }
    });
};

/* account lookup methods */

var deleteAccount = function(id, callback) {
    accounts.remove({_id: id}, callback);
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
        if (account) {
            callback(null, account);
        } else {
            error.user = 'User not found';
            callback(error, null);
        }
    });
};

var validateResetLink = function(email, passHash, callback) {
    accounts.findOne({'profile.email': email, 'credentials.tpass': passHash},
        function(e, account) {
            if (account) {
                callback(null, account);
            } else {
                callback('Really user not found??', null);
            }
    });
};

var resetPassword = function(email, passHash, newPass, callback) {
    accounts.findOne({'profile.email': email, 'credentials.tpass': passHash},
        function(e, account) {
            if (account) {
                saltAndHash(newPass, function(hash) {
                    account.credentials = {
                        pass: hash,
                        user: account.credentials.user
                    };
                    accounts.save(account, {safe: true}, function() {
                        callback(null, account.profile);
                    });
                });
            } else {
                callback('Really user not found??', null);
            }
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
    autoLogin: autoLogin,
    manualLogin: manualLogin,
    addNewAccount: addNewAccount,
    updateProfile: updateProfile,
    updatePassword: updatePassword,
    deleteAccount: deleteAccount,
    getAccountByEmail: getAccountByEmail,
    validateResetLink: validateResetLink,
    getAllRecords: getAllRecords,
    delAllRecords: delAllRecords,
    makeAccount: makeAccount,
    seedAccountWithResetKey: seedAccountWithResetKey,
    resetPassword: resetPassword
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

/**
 * For newly created accounts, this converts the given pass field in the
 * given account to a salted hash of the password.
 */
var convertPwToSaltedHash = function(account, newPass, callback) {

    var shCallback = function(hash) {
        account.credentials.pass = hash;
        accounts.insert(account, {safe: true},
            function() {
                callback(null, account.profile);
            }
        );
    };

    saltAndHash(newPass, shCallback);
};

/**
 * Checks that the given user name is unique in the accounts collection.
 * @param {string} username The username to check for uniqueness.
 * @param {function} callback The callback function, should take 2 parameters:
 *      error - The error object if something went wrong with the query.
 *      account - The account - Null if the given username is unique, else the
 *              account that was found with the given username.
 */
var checkUniqueUsername = function(username, callback) {
    accounts.findOne(
        {'credentials.user': username},
        callback
    );
};

var checkUniqueEmail = function(email, callback) {
    accounts.findOne(
        {'profile.email': email},
        callback
    );
};

var validatePassword = function(plainPass, hashedPass, callback) {
    var salt = hashedPass.substr(0, 10);
    var validHash = salt + md5(plainPass + salt);
    callback(hashedPass === validHash);
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
