var pjson = require('../package.json');
var routes = require('../routes');
var user = require('../routes/user');
var path = require('path');
var root = path.resolve(__dirname, '../');

/**
 * Site specific configuration.
 * @type {Object}
 */
var conf = {
    path: {
        ROOT: root,
        VIEWS: path.join(root, 'views'),
        PUBLIC: path.join(root, 'public'),
        DEPS: path.join('js', 'deps.js'),
        BOOTSTRAP: path.join('js', 'bootstrap.js'),
        GOOG: path.join('js', 'closure-library/closure/goog/base.js'),
        CSS: path.join('css', 'default2.css'),
        compiled: {
            JS: path.join('js', 'compiled/' + pjson.name + '_' + pjson.version + '.js'),
            CSS: path.join('css', 'compiled/' + pjson.name + '_' + pjson.version + '.css')
        }
    },
    engine: 'jade',
    production: false,
    compiled: {
        JS: false,
        CSS: false
    }
};

/**
 * Seed the conf with a root directory
 */
var init = function() {
// Switch between production and development
    if (conf.production) {
        conf.mqttServer = '54.229.30.67';
        conf.mqttPort = 80;
        conf.wsServer = '54.229.30.67';
        conf.wsPort = 80;
        conf.port = 80;
    } else {
        conf.mqttServer = '54.229.30.67';
        conf.mqttPort = 80;
        conf.wsServer = 'localhost';
        conf.wsPort = process.env.PORT || 3000;
        conf.port = process.env.PORT || 3000;
    }
};

/**
 * Configure the app, and express
 * @param app
 * @param express
 */
var configure = function(app, express) {

    // Set some stuff up
    init();

    // all environments
    app.set('port', conf.port)
        .set('views', conf.path.VIEWS)
        .set('view engine', conf.engine)
        .set('mqttServer', conf.mqttServer)
        .set('mqttPort', conf.mqttPort)
        .set('wsServer', conf.wsServer)
        .set('wsPort', conf.wsPort)
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

    // To switch between compiled and basic CSS.
    if (conf.compiled.CSS) {
        app.enable('cssIsCompiled');
    } else {
        app.disable('cssIsCompiled');
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

module.exports.init = init;
module.exports.configure = configure;