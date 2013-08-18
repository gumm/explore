goog.provide('exp.routes');

goog.require('exp.routesHelper');

var helper = exp.routesHelper;

exp.routes.index = function(req, res) {
    var response = helper.getBasicSetup(req);
    res.render('index', response);
};

exp.routes.home = function(req, res) {
    var getCall = function() {
        if (!req.session.user) {
            res.redirect('/');
        } else {
            res.render('home',
                helper.makeReplyWith(null, req.session.user.profile));
        }
    };
    helper.okGo(req, res, {'GET': getCall});
};

exp.routes.intro = function(req, res) {
    var app = req.app;
    res.render('intro', {title: app.get('title')});
};

exp.routes.header = function(req, res) {
    var getCall = function() {
        if (!req.session.user) {
            res.render('header', {});
        } else {
            res.render('header',
                helper.makeReplyWith(null, req.session.user.profile));
        }
    };
    helper.okGo(req, res, {'GET': getCall});
};

exp.routes.logout = function(req, res) {
    var postCall = function() {
        if (req.param('logout') === 'true') {
            res.clearCookie('user');
            res.clearCookie('pass');
            req.session.destroy(function() {
                res.send('ok', 200);
            });
        }
    };
    helper.okGo(req, res, {'POST': postCall});
};

exp.routes.four_oh_four = function(req, res) {
    res.render('404', { title: 'Page Not Found'});
};
