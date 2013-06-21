var CT = require('../modules/country-list');
var AM = require('../modules/account-manager');
var EM = require('../modules/email-dispatcher');

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
        req.session.user.user &&
        req.session.user.pass) {
        var user = req.session.user.user;
        var pass = req.session.user.pass;
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
    res.render('login', {title: 'Hello - Please Login To Your Account'});
};

exports.postLogin = function(req, res) {
    var user = req.param('user');
    var password = req.param('pass');

    AM.manualLogin(user, password, function(e, o) {
        if (!o) {
            res.send(e, 400);
        } else {
            req.session.user = o;
            if (req.param('remember-me') === 'true') {
                res.cookie('user', o.user, { maxAge: 900000 });
                res.cookie('pass', o.pass, { maxAge: 900000 });
            }
            res.send(o, 200);
        }
    });
};

exports.intro = function(req, res) {
    var app = req.app;
    res.render('intro', {title: app.get('title')});
};

//------------------------------------------------------------[ New Accounts ]--

exports.signUp = function(req, res) {
    res.render('signup', {countries: CT});
};

exports.postSignUp = function(req, res) {
    var credentials = {
        name: req.param('name'),
        email: req.param('email'),
        user: req.param('user'),
        pass: req.param('pass'),
        country: req.param('country')
    };
    var callback = function(e) {
        if (e) {
            res.send(e, 400);
        } else {
            res.send('OK', 200);
        }
    };
    AM.addNewAccount(credentials, callback);
};

//-----------------------------------------------------------[ Edit Accounts ]--

exports.editAccount = function(req, res) {
    res.render('editaccount', {countries: CT, udata: req.session.user});
};

exports.postEditAccount = function(req, res) {
    var credentials = {
        user: req.param('user'),
        name: req.param('name'),
        email: req.param('email'),
        country: req.param('country'),
        pass: req.param('pass')
    };
    var callback = function(e, o) {
        if (e) {
            res.send('error-updating-account', 400);
        } else {
            req.session.user = o;
            // update the user's login cookies if they exists //
            if (req.cookies.user !== undefined &&
                req.cookies.pass !== undefined) {
                res.cookie('user', o.user, { maxAge: 900000 });
                res.cookie('pass', o.pass, { maxAge: 900000 });
            }
            res.send('ok', 200);
        }
    };

    if (req.param('user') !== undefined) {
        AM.updateAccount(credentials, callback);
    }
};


//-------------------------------------------------[ Logged-in User Homepage ]--

exports.home = function(req, res) {
    if (!req.session.user) {
        // if user is not logged-in redirect back to login page //
        res.redirect('/');
    } else {
        res.render('home', {
            title: 'Control Panel',
//            countries: CT,
            udata: req.session.user
        });
    }
};

exports.postHome = function(req, res) {

    if (req.param('logout') === 'true') {
        res.clearCookie('user');
        res.clearCookie('pass');
        req.session.destroy(function(e) {
            res.send('ok', 200);
        });
    }
};

//----------------------------------------------------------[ Password Reset ]--

exports.lostPassword = function(req, res) {
    res.render('lost-password', {title: 'Signup', countries: CT});
};

exports.postLostPassword = function(req, res) {
    // look up the user's account via their email //
    AM.getAccountByEmail(req.param('email'), function(o) {
        if (o) {
            res.send('ok', 200);
            EM.dispatchResetPasswordLink(o, function(e, m) {
                // this callback takes a moment to return //
                // should add an ajax loader to give user feedback //
                if (!e) {
                    //res.send('ok', 200);
                } else {
                    res.send('email-server-error', 400);
                    for (k in e) console.log('error : ', k, e[k]);
                }
            });
        } else {
            res.send('email-not-found', 400);
        }
    });
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


