var CT = require('../modules/country-list');
var AM = require('../modules/account-manager');
var EM = require('../modules/email-dispatcher');

/**
 * A generic reply object.
 * @param {?(Object|string)=} opt_err
 * @param {?(Object|string)=} opt_data
 * @param {?string=} opt_message
 * @returns {{error: (*|null), data: (*|null), message: (*|null)}}
 */
var getReply = function(opt_err, opt_data, opt_message) {
    return {
        error: opt_err || null,
        data: opt_data || null,
        message: opt_message || null
    };
};

var notSupported = function(res) {
    res.send('Method not supported', 400);
};


var okGo = function(req, res, obj) {
    if(obj[req.method]) {
        obj[req.method]();
    } else {
        notSupported(res);
    }
};

var getBasicSetup = function(req) {
    var app = req.app;
    return {
        jsIsCompiled: app.enabled('jsIsCompiled'),
        cssIsCompiled: app.enabled('cssIsCompiled'),
        title: app.get('title'),
        jsCompiled: app.get('jsCompiled'),
        cssBasic: app.get('cssBasic'),
        cssCompiled: app.get('cssCompiled'),
        goog: app.get('goog'),
        deps: app.get('deps'),
        bootstrap: app.get('bootstrap'),
        wsPort: app.get('wsPort'),
        wsServer: app.get('wsServer'),
        landing: null
    };
};

exports.index = function(req, res) {
    res.render('index', getBasicSetup(req));
};

//------------------------------------------------------------------[ Log In ]--

exports.autoLogin = function(req, res) {
    var noAuto = 'No Auto Login Possible';

    /**
     * BEWARE: The account passed in here contains the full account.
     * Only pass the profile component to the user.
     * @param {Object} account The full account object from mongo.
     */
    var callback = function(account) {
        if (account) {
            req.session.user = account;
            res.send(getReply(null, account.profile));
        } else {
            res.send(getReply(noAuto), 200);
        }
    };

    /**
     * If the session has all the required info to identify a user,
     * use the session info to log in.
     */
    var getCall = function() {
        if (req.session &&
            req.session.user &&
            req.session.user.credentials &&
            req.session.user.credentials.user &&
            req.session.user.credentials.pass) {
                AM.autoLogin(
                    req.session.user.credentials.user,
                    req.session.user.credentials.pass,
                    callback);
        } else {
            res.send(getReply(noAuto), 200);
        }
    };

    okGo(req, res, {'GET': getCall});
};

exports.login = function(req, res) {
    /**
     * BEWARE: The account passed in here contains the full account.
     * Only pass the profile component to the user.
     * @param {Object} err The Error object if any.
     * @param {Object} account The full account object from mongo.
     */
    var callback = function(err, account) {
        if (!account) {
            res.send(getReply(err), 400);
        } else {
            req.session.user = account;
            res.send(getReply(null, account.profile, 'Login Successful'), 200);
        }
    };

    var getCall = function() {
        res.render('login', {});
    };

    var postCall = function() {
        var user = req.param('user');
        var pass = req.param('pass');
        AM.manualLogin(user, pass, callback);
    };

    okGo(req, res, {'GET': getCall, 'POST': postCall});
};

exports.header = function(req, res) {

    var getCall = function() {
        if (!req.session.user) {
            // if user is not logged-in redirect back to login page //
            res.redirect('/');
        } else {
            res.render('header', getReply(null, req.session.user.profile));
        }
    };

    var postCall = function() {
        if (req.param('logout') === 'true') {
            res.clearCookie('user');
            res.clearCookie('pass');
            req.session.destroy(function() {
                res.send('ok', 200);
            });
        }
    };

    okGo(req, res, {'GET': getCall, 'POST': postCall});
};

exports.intro = function(req, res) {
    var app = req.app;
    res.render('intro', {title: app.get('title')});
};

exports.loginHeader = function(req, res) {
    var app = req.app;
    res.render('loginheader', {title: app.get('title')});
};

//------------------------------------------------------------[ New Accounts ]--

exports.signUp = function(req, res) {
    var getCall = function() {
        var user = AM.makeAccount({});
        res.render('signup', {udata: user.profile});
    };

    var postCall = function() {
        var newAccount = AM.makeAccount({
            name: req.param('name'),
            surname: req.param('surname'),
            email: req.param('email'),
            user: req.param('user'),
            pass: req.param('pass'),
            country: req.param('country')
        });
        var callback = function(error, profile) {
            if (error) {
                res.send(getReply(error), 400);
            } else {
                res.send(getReply(null, profile, 'New account created'), 200);
            }
        };
        AM.addNewAccount(newAccount, callback);
    };

    okGo(req, res, {'GET': getCall, 'POST': postCall});
};

//-----------------------------------------------------------[ Edit Accounts ]--

exports.editProfile = function(req, res) {
    /**
     * BEWARE: The account passed in here contains the full account.
     * Only pass the profile component to the user.
     * @param {Object} err The Error object if any.
     * @param {Object} account The full account object from mongo.
     */
    var callback = function(err, account) {
        if (err) {
            res.send(getReply('Error updating account: ' + err), 400);
        } else if(account) {
            req.session.user = account;
            res.send(getReply(null, account.profile, 'Account updated'), 200);
        } else {
            res.send(getReply('Could not find account'), 400);
        }
    };

    var getCall = function() {
        var user = req.session.user;
        res.render('editaccount', {countries: CT, udata: user.profile});
    };

    var postCall = function() {
        var currentUser = req.session.user;

        // This is from the form.
        var newData = AM.makeAccount({
            name: req.param('name'),
            surname: req.param('surname'),
            email: req.param('email'),
            url: req.param('url'),
            user: req.param('user'),
            pass: req.param('pass'),
            city: req.param('city'),
            country: req.param('country'),
            phone: req.param('phone'),
            cell: req.param('cell')
        });
        AM.updateProfile(currentUser._id, newData, callback);
    };

    okGo(req, res, {'GET': getCall, 'POST': postCall});
};

exports.editPassword = function(req, res) {

    var getCall = function() {
        var user = req.session.user;
        res.render('editpassword', {udata: user.profile});
    };

    var postCall = function() {
        var currentUser = req.session.user;

        // This is from the form.
        var passwords = {
            currentPass: req.param('currpass'),
            newPass: req.param('pass')
        };

        // This is what comes back from the Account Manager
        var callback = function(err, profile) {
            if (err) {
                res.send(getReply(err), 400);
            } else if(profile) {
                res.send(getReply(null, profile, 'Password updated'), 200);
            }
        };
        AM.updatePassword(currentUser._id, passwords, callback);
    };

    okGo(req, res, {'GET': getCall, 'POST': postCall});
};


//-------------------------------------------------[ Logged-in User Homepage ]--

exports.home = function(req, res) {

    var getCall = function() {
        if (!req.session.user) {
            // if user is not logged-in redirect back to login page //
            res.redirect('/');
        } else {
            res.render('home', getReply(null, req.session.user.profile));
        }
    };

    okGo(req, res, {'GET': getCall});
};

//----------------------------------------------------------[ Password Reset ]--

exports.lostPassword = function(req, res) {

    var getCall = function() {
        res.render('lost-password', {});
    };

    var postCall = function() {
        var email = req.param('email');
        AM.seedAccountWithResetKey(email, function(err, account) {
            if (account) {
                EM.dispatchResetPasswordLink(account, function(err) {
                    // this callback takes a moment to return //
                    // should add an ajax loader to give user feedback //
                    if (err) {
                        var errMsg = 'Server Error. No reset email sent. ';
                        errMsg = errMsg + 'Message from email server: ' + err;
                        res.send(getReply({email: errMsg}), 400);
                    } else {
                        res.send(getReply(
                            null,
                            null,
                            'Reset link sent. Please check your email.'
                        ), 200);
                    }
                });
            } else {
                res.send(getReply(err), 400);
            }
        });
    };

    okGo(req, res, {'GET': getCall, 'POST': postCall});
};

exports.resetPassword = function(req, res) {

    var getCall = function() {
        var email = req.query["e"];
        var passH = req.query["p"];

        AM.validateResetLink(email, passH, function(err, account) {
            if (!account) {
                console.log('Error:', err);
                res.redirect('/');
            } else {
                // save the user's email in a session instead of
                // sending to the client //
                req.session.reset = { email: email, passHash: passH };
                var setup = getBasicSetup(req);
                setup.landing = 'resetpw';
                setup.user = account.credentials.user;
                res.render('resetpassword', setup);
            }
        });
    };

    var postCall = function() {
        var nPass = req.param('pass');
        var email = req.session.reset.email;
        var passH = req.session.reset.passHash;
        req.session.destroy();

        AM.resetPassword(email, passH, nPass, function(err, profile) {
            if (profile) {
                res.send(getReply(
                    null,
                    profile,
                    'Your password has been reset'
                ), 200);
            } else {
                res.send(getReply('Unable to update password' + err), 400);
            }
        });
    };

    okGo(req, res, {'GET': getCall, 'POST': postCall});
};

//--------------------------------------------------[ View & Delete Accounts ]--

exports.deleteAccount = function(req, res) {

    var confPhrase = 'joe is a dork';

    var getCall = function() {
        res.render('accountdelete', {confPhrase: confPhrase});
    };


    var onDeleteCallback = function(e) {
        if (!e) {
            res.clearCookie('user', {path: '/'});
            res.clearCookie('pass', {path: '/'});
            req.session.destroy(function() {
                res.send('Success: Account deleted', 200);
            });
        } else {
            res.send('Account not found', 400);
        }
    };

    /**
     * BEWARE: The account passed in here contains the full account.
     * Only pass the profile component to the user.
     * @param {Object} err The Error object if any.
     * @param {Object} account The full account object from mongo.
     */
    var onGetAccountCallback = function(err, account) {
        if (!account) {
            res.send(getReply(err), 400);
        } else {
            console.log('Here is the account:', account);
            AM.deleteAccount(account._id, onDeleteCallback);
        }
    };

    var postCall = function() {
        var user = req.param('user');
        var pass = req.param('pass');
        AM.manualLogin(user, pass, onGetAccountCallback);
    };

    okGo(req, res, {'GET': getCall, 'POST': postCall});
};


exports.accounts = function(req, res) {
    AM.getAllRecords(function(e, accounts) {
        res.render('accounts', { title: 'Account List', accts: accounts });
    });
};

//    app.post('/delete', function(req, res) {
//        AM.deleteAccount(req.body.id, function(e, obj) {
//            if (!e) {
//                res.clearCookie('user');
//                res.clearCookie('pass');
//                req.session.destroy(function(e) {
//                    res.send('ok', 200);
//                });
//            } else {
//                res.send('record not found', 400);
//            }
//        });
//    });

//    app.get('/reset', function(req, res) {
//        AM.delAllRecords(function() {
//            res.redirect('/print');
//        });
//    });

exports.four_oh_four = function(req, res) {
    res.render('404', { title: 'Page Not Found'});
};


