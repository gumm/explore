var CT = require('../modules/country-list');
var AM = require('../modules/account-manager');
var EM = require('../modules/email-dispatcher');

var makeAccount = function(data) {
    return {
        profile: {
            name: data.name || null,
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

exports.index = function(req, res) {
    var app = req.app;

    res.render('index', {
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
        wsServer: app.get('wsServer')
    });
};

//------------------------------------------------------------------[ Log In ]--

exports.autoLogin = function(req, res) {
    var errorReply = {error: 'No Auto Login Possible'};
    if (req.session &&
        req.session.user &&
        req.session.user.credentials &&
        req.session.user.credentials.user &&
        req.session.user.credentials.pass) {
        var user = req.session.user.credentials.user;
        var pass = req.session.user.credentials.pass;
        AM.autoLogin(user, pass, function(o) {
            if (o !== null) {
                req.session.user = o;
                res.send(req.session.user);
            } else {
                res.send(errorReply);
            }
        });
    } else {
        res.send(errorReply);
    }
};

exports.login = function(req, res) {
    var getCall = function() {
        res.render('login', {});
    };

    var postCall = function() {
        var user = req.param('user');
        var password = req.param('pass');
        var reply = {
            error: null,
            data: null,
            message: null
        };

        AM.manualLogin(user, password, function(err, obj) {
            if (!obj) {
                reply.error = err;
                res.send(reply, 400);
            } else {
                req.session.user = obj;
            /* These not necessary with sessions
            if (remember === 'on') {
                res.cookie('user', obj.credentials.user, { maxAge: 900000 });
                res.cookie('pass', obj.credentials.pass, { maxAge: 900000 });
            }
            */
                reply.data = obj;
                res.send(reply, 200);
            }
        });
    };

    switch (req.method) {
        case 'GET':
            getCall();
            break;
        case 'POST':
            postCall();
            break;
        default:
            res.send('Method not supported', 400);
    }
};

exports.intro = function(req, res) {
    var app = req.app;
    res.render('intro', {title: app.get('title')});
};

//------------------------------------------------------------[ New Accounts ]--

exports.signUp = function(req, res) {
    var getCall = function() {
        var user = makeAccount({});
        res.render('signup', {udata: user.profile});
    };

    var postCall = function() {
        var newAccount = makeAccount({
            name: req.param('name'),
            email: req.param('email'),
            user: req.param('user'),
            pass: req.param('pass'),
            country: req.param('country')
        });

        var reply = {
            error: null,
            data: null,
            message: null
        };

        var callback = function(error, account) {
            if (error) {
                reply.error = error;
                res.send(reply, 400);
            } else {
                reply.data = account;
                reply.message = 'New account created';
                res.send(reply, 200);
            }
        };
        AM.addNewAccount(newAccount, callback);
    };

    switch (req.method) {
        case 'GET':
            getCall();
            break;
        case 'POST':
            postCall();
            break;
        default:
            res.send('Method not supported', 400);
    }
};

//-----------------------------------------------------------[ Edit Accounts ]--

exports.editProfile = function(req, res) {

    var getCall = function() {
        var user = req.session.user;
        res.render('editaccount', {countries: CT, udata: user.profile});
    };

    var postCall = function() {
        var currentUser = req.session.user;

        // This is from the form.
        var newData = makeAccount({
            name: req.param('name'),
            email: req.param('email'),
            url: req.param('url'),
            user: req.param('user'),
            pass: req.param('pass'),
            city: req.param('city'),
            country: req.param('country'),
            phone: req.param('phone'),
            cell: req.param('cell')
        });

        // This is the reply object
        var reply = {
            error: null,
            data: null,
            message: null
        };

        // This is what comes back from the Account Manager
        var callback = function(err, user) {
            if (err) {
                reply.error = 'Error updating account: ' + err;
                res.send(reply, 400);
            } else if(user) {
                req.session.user = user;
                reply.data = user.profile;
                reply.message = 'Account updated';
                res.send(reply, 200);
            } else {
                reply.error = 'Could not find account';
                res.send(reply, 400);
            }
        };
        AM.updateProfile(currentUser._id, newData, callback);
    };

    switch (req.method) {
        case 'GET':
            getCall();
            break;
        case 'POST':
            postCall();
            break;
        default:
            res.send('Method not supported', 400);
    }
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

        // This is the reply object
        var reply = {
            error: null,
            data: null,
            message: null
        };

        // This is what comes back from the Account Manager
        var callback = function(err, account) {
            if (err) {
                reply.error = err;
                res.send(reply, 400);
            } else if(account) {
                reply.data = account;
                reply.message = 'Password updated';
                res.send(reply, 200);
            }
        };
        AM.updatePassword(currentUser._id, passwords, callback);
    };

    switch (req.method) {
        case 'GET':
            getCall();
            break;
        case 'POST':
            postCall();
            break;
        default:
            res.send('Method not supported', 400);
    }
};


//-------------------------------------------------[ Logged-in User Homepage ]--

exports.home = function(req, res) {

    var getCall = function() {
        if (!req.session.user) {
            // if user is not logged-in redirect back to login page //
            res.redirect('/');
        } else {
            res.render('home', {
                title: 'Control Panel',
                // countries: CT,
                udata: req.session.user
            });
        }
    };

    var postCall = function() {
        if (req.param('logout') === 'true') {
            res.clearCookie('user');
            res.clearCookie('pass');
            req.session.destroy(function(e) {
                res.send('ok', 200);
            });
        }
    };

    switch (req.method) {
        case 'GET':
            getCall();
            break;
        case 'POST':
            postCall();
            break;
        default:
            res.send('Method not supported', 400);
    }
};

//----------------------------------------------------------[ Password Reset ]--

exports.lostPassword = function(req, res) {

    var getCall = function() {
        res.render('lost-password', {title: 'Signup', countries: CT});
    };

    var postCall = function() {
        var email = req.param('email');
        var reply = {
            error: null,
            data: null,
            message: null
        };

        AM.getAccountByEmail(email, function(err, obj) {
            if (obj) {
                EM.dispatchResetPasswordLink(obj, function(e, m) {
                    // this callback takes a moment to return //
                    // should add an ajax loader to give user feedback //
                    if (!e) {
                        reply.data = {
                            email: 'Reset link sent. Please check your email.'
                        };
                        res.send(reply, 200);
                    } else {
                        reply.error = {email: 'Server Error. No reset email sent.'};
                        res.send(reply, 400);

                        // This is just debug...
                        for (k in e) {
                            console.log('error : ', k, e[k]);
                        }
                    }
                });
            } else {
                reply.error = err;
                res.send(reply, 400);
            }
        });
    };

    switch (req.method) {
        case 'GET':
            getCall();
            break;
        case 'POST':
            postCall();
            break;
        default:
            res.send('Method not supported', 400);
    }
};

//    app.get('/reset-password', function(req, res) {
//        var email = req.query["e"];
//        var passH = req.query["p"];
//        AM.validateResetLink(email, passH, function(e) {
//            if (e != 'ok') {
//                res.redirect('/');
//            } else {
//                // save the user's email in a session instead of sending to the client //
//                req.session.reset = { email: email, passHash: passH };
//                res.render('reset', { title: 'Reset Password' });
//            }
//        })
//    });

//    app.post('/reset-password', function(req, res) {
//        var nPass = req.param('pass');
//        // retrieve the user's email from the session to lookup their account and reset password //
//        var email = req.session.reset.email;
//        // destory the session immediately after retrieving the stored email //
//        req.session.destroy();
//        AM.updatePassword(email, nPass, function(e, o) {
//            if (o) {
//                res.send('ok', 200);
//            } else {
//                res.send('unable to update password', 400);
//            }
//        })
//    });

//--------------------------------------------------[ View & Delete Accounts ]--

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


