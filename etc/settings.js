var pjson = require('../package.json');
var routes = require('../routes');
var user = require('../routes/user');
var path = require('path');

var configure = function(app, express, dir) {

    var conf = {
        path: {
            ROOT: dir,
            VIEWS: path.join(dir, 'views'),
            PUBLIC: path.join(dir, 'public'),
            DEPS: path.join('js', 'deps.js'),
            BOOTSTRAP: path.join('js', 'bootstrap.js'),
            GOOG: path.join('js', 'closure-library/closure/goog/base.js'),
            CSS: path.join('css', 'default.css'),
            compiled: {
                JS: path.join('js', 'compiled/' + pjson.name + '_' + pjson.version + '.js'),
                CSS: path.join('css', 'compiled/' + pjson.name + '_' + pjson.version + '.css')
            }
        },
        engine: 'jade',
        port: process.env.PORT || 3000,
        compiled: {
            JS: true,
            CSS: true
        }
    };

    // all environments
    app.set('port', conf.port)
        .set('views', conf.path.VIEWS)
        .set('view engine', conf.engine)
        .set('goog', conf.path.GOOG)
        .set('deps', conf.path.DEPS)
        .set('bootstrap', conf.path.BOOTSTRAP)
        .set('cssBasic', conf.path.CSS)
        .set('title', pjson.name)
        .set('version', pjson.version)
        .set('jsCompiled', conf.path.compiled.JS)
        .set('cssCompiled', conf.path.compiled.CSS);

    // To change between compiled and un-compiled mode
    // use enable or disable.
    if (conf.compiled.JS) {
        app.enable('jsIsCompiled');
    } else {
        app.disable('jsIsCompiled');
    }

    // Middleware
    app.use(express.compress())
        .use(express.favicon())
        .use(express.logger('dev'))
        .use(express.bodyParser())
        .use(express.methodOverride())
        .use(app.router)
        .use(express.static(conf.path.PUBLIC));

    // Development only
    if ('development' === app.get('env')) {
        app.use(express.errorHandler());
    }

    app.get('/', routes.index);
    app.get('/users', user.list);
};

module.exports.configure = configure;