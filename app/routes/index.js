/*
 * GET home page.
 */

exports.index = function (req, res) {
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

exports.landing = function (req, res) {
    var app = req.app;

    res.render('panel', {
        title: app.get('title')
    });
};

exports.login = function (req, res) {
    res.render('login', { title: 'Hello - Please Login To Your Account' });
};

exports.postLogin = function (req, res) {
    var user = req.param('user');
    var password = req.param('pass');
    console.log('USER:', user);
    console.log('PASSWORD:', password);
};

// creating new accounts //
exports.signup = function (req, res) {
    res.render('signup', {  title: 'Signup', countries: CT });
};

exports.postSignup = function (req, res) {
    AM.addNewAccount({
        name: req.param('name'),
        email: req.param('email'),
        user: req.param('user'),
        pass: req.param('pass'),
        country: req.param('country')
    }, function (e) {
        if (e) {
            res.send(e, 400);
        } else {
            res.send('ok', 200);
        }
    });
};
