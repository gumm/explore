var AM = require('../modules/account-manager');
var OM = require('../modules/orgs-manager');

goog.provide('exp.routes.user');

goog.require('exp.countryList');
goog.require('exp.EmailDispatcher');
goog.require('exp.routesHelper');

var helper = exp.routesHelper;

//------------------------------------------------------------------[ Log In ]--

exp.routes.user.autoLogin = function(req, res) {
    var noAuto = 'No Auto Login Possible';

    /**
     * BEWARE: The account passed in here contains the full account.
     * Only pass the profile component to the user.
     * @param {Object} account The full account object from mongo.
     */
    var callback = function(account) {
        if (account) {
            req.session.user = account;
            res.send(helper.makeReplyWith(null, account.profile));
        } else {
            res.send(helper.makeReplyWith(noAuto), 200);
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
            res.send(helper.makeReplyWith(noAuto), 200);
        }
    };

    helper.okGo(req, res, {'GET': getCall});
};

exp.routes.user.login = function(req, res) {
    /**
     * BEWARE: The account passed in here contains the full account.
     * Only pass the profile component to the user.
     * @param {Object} err The Error object if any.
     * @param {Object} account The full account object from mongo.
     */
    var callback = function(err, account) {
        if (!account) {
            res.send(helper.makeReplyWith(err), 400);
        } else {
            req.session.user = account;
            res.send(
                helper.makeReplyWith(null, account.profile, 'Login Successful'),
                200);
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

    helper.okGo(req, res, {'GET': getCall, 'POST': postCall});
};

//------------------------------------------------------------[ New Accounts ]--

exp.routes.user.signUp = function(req, res) {
    var getCall = function() {
        var user = AM.makeAccount({});
        res.render('user/create', {udata: user.profile});
    };

    var postCall = function() {
        var cleanCountry = req.param('country') === exp.countryList[0].name ?
            null : req.param('country');
        var newAccount = AM.makeAccount({
            name: req.param('name'),
            surname: req.param('surname'),
            email: req.param('email'),
            user: req.param('user'),
            pass: req.param('pass'),
            country: cleanCountry
        });
        var callback = function(error, profile) {
            if (error) {
                res.send(helper.makeReplyWith(error), 400);
            } else {
                res.send(
                    helper.makeReplyWith(null, profile, 'New account created'),
                    200);
            }
        };
        AM.addNewAccount(newAccount, callback);
    };

    helper.okGo(req, res, {'GET': getCall, 'POST': postCall});
};

//-----------------------------------------------------------[ Read Accounts ]--

exp.routes.user.readProfile = function(req, res) {
    var id = req.params.id;
    if(id) {
        exp.routes.user.readPublicProfile(req, res, id);
    } else {
        exp.routes.user.readOwnProfile(req, res);
    }
};

exp.routes.user.readOwnProfile = function(req, res) {
    console.log('Private profile');
    var getCall = function() {
        var user = req.session.user;
        res.render('user/view', {udata: user.profile});
    };
    helper.okGo(req, res, {'GET': getCall});
};

exp.routes.user.readPublicProfile = function(req, res, id) {
    console.log('Public profile' , id);
    var transform = function(acc) {
        return acc.profile;
    };

    var callback = function(err, account) {
        if (err) {
            res.send(helper.makeReplyWith(err), 400);
        } else {
            res.render('user/view', {udata: account});
        }
    };

    var getCall = function() {
        AM.findById(id, callback, transform);
    };
    helper.okGo(req, res, {'GET': getCall});
};

//-----------------------------------------------------------[ Edit Accounts ]--

exp.routes.user.editProfile = function(req, res) {
    /**
     * BEWARE: The account passed in here contains the full account.
     * Only pass the profile component to the user.
     * @param {Object} err The Error object if any.
     * @param {Object} account The full account object from mongo.
     */
    var callback = function(err, account) {
        if (err) {
            res.send(
                helper.makeReplyWith('Error updating account: ' + err),
                400);
        } else if(account) {
            req.session.user = account;
            res.send(
                helper.makeReplyWith(null, account.profile, 'Account updated'),
                200);
        } else {
            res.send(
                helper.makeReplyWith('Could not find account'),
                400);
        }
    };

    var getCall = function() {
        var user = req.session.user;
        res.render(
            'user/edit/profile',
            {countries: exp.countryList, udata: user.profile});
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

    helper.okGo(req, res, {'GET': getCall, 'POST': postCall});
};

exp.routes.user.editPassword = function(req, res) {

    var getCall = function() {
        var user = req.session.user;
        res.render('user/edit/password', {udata: user.profile});
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
                res.send(helper.makeReplyWith(err), 400);
            } else if(profile) {
                res.send(
                    helper.makeReplyWith(null, profile, 'Password updated'),
                    200);
            }
        };
        AM.updatePassword(currentUser._id, passwords, callback);
    };

    helper.okGo(req, res, {'GET': getCall, 'POST': postCall});
};

//----------------------------------------------------------[ Password Reset ]--

exp.routes.user.lostPassword = function(req, res) {

    var getCall = function() {
        res.render('lost-password', {});
    };

    var postCall = function() {
        var email = req.param('email');
        AM.seedAccountWithResetKey(email, function(err, account) {
            if (account) {
                var dispatcher = new exp.EmailDispatcher();
                dispatcher.dispatchResetPasswordLink(account, function(err) {
                    // this callback takes a moment to return //
                    // should add an ajax loader to give user feedback //
                    if (err) {
                        var errMsg = 'Server Error. No reset email sent. ';
                        errMsg = errMsg + 'Message from email server: ' + err;
                        res.send(helper.makeReplyWith({email: errMsg}), 400);
                    } else {
                        res.send(helper.makeReplyWith(
                            null,
                            null,
                            'Reset link sent. Please check your email.'
                        ), 200);
                    }
                });
            } else {
                res.send(helper.makeReplyWith(err), 400);
            }
        });
    };

    helper.okGo(req, res, {'GET': getCall, 'POST': postCall});
};

exp.routes.user.resetPassword = function(req, res) {

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
                var setup = exp.routes.user.getBasicSetup(req);
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
                res.send(helper.makeReplyWith(
                    null,
                    profile,
                    'Your password has been reset'
                ), 200);
            } else {
                res.send(
                    helper.makeReplyWith('Unable to update password' + err),
                    400);
            }
        });
    };

    helper.okGo(req, res, {'GET': getCall, 'POST': postCall});
};

//--------------------------------------------------[ View & Delete Accounts ]--

exp.routes.user.deleteAccount = function(req, res) {

    var confPhrase = 'Please delete my account and all my data';

    var doesUserOwnOrgs = function() {
        var account = req.session.user;
        OM.getOrgsByOwnerId(account._id, function(err, orgList) {
            if (err) {
                res.send(helper.makeReplyWith(err), 400);
            } else if(orgList.length > 0) {
                res.render('user/nodelete', {oList: orgList});
            } else {
                res.render('user/delete', {confPhrase: confPhrase});
            }
        });
    };

    var getCall = function() {
        doesUserOwnOrgs();
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
            res.send(helper.makeReplyWith(err), 400);
        } else {
            OM.getOrgsByOwnerId(account._id, function(err, orgList) {
                if (err) {
                    res.send(helper.makeReplyWith(err), 400);
                } else if(orgList.length > 0) {
                    res.send(helper.makeReplyWith('You still own orgs'), 400);
                } else {
                    AM.deleteAccount(account._id, onDeleteCallback);
                }
            });
        }
    };

    var postCall = function() {
        var user = req.param('user');
        var pass = req.param('pass');
        AM.manualLogin(user, pass, onGetAccountCallback);
    };

    helper.okGo(req, res, {'GET': getCall, 'POST': postCall});
};

exp.routes.user.accounts = function(req, res) {
    AM.getAllRecords(function(e, accounts) {
        res.render('accounts', { title: 'Account List', accts: accounts });
    });
};

//    app.get('/reset', function(req, res) {
//        AM.delAllRecords(function() {
//            res.redirect('/print');
//        });
//    });




