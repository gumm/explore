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
            res.render('home', helper.makeReplyWith(null, req.session.user.profile));
        }
    };

    helper.okGo(req, res, {'GET': getCall});
};

exp.routes.four_oh_four = function(req, res) {
    res.render('404', { title: 'Page Not Found'});
};
