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
        CSS: path.join('css', 'default.css'),
        compiled: {
            JS: path.join('js', 'compiled/' + pjson.name + '_' + pjson.version + '.js'),
            CSS: path.join('css', 'compiled/' + pjson.name + '_' + pjson.version + '.css')
        }
    },
    engine: 'jade',
    mqttServer: '54.229.30.67',
    mqttPort: 80,
    wsServer: 'localhost',
    wsPort: process.env.PORT || 3000,
    port: process.env.PORT || 3000,
    compiled: {
        JS: true,
        CSS: true
    }
};

/**
 * Seed the conf with a root directory
 * @param dir
 */
var init = function(dir) {

};

/**
 * Configure the app, and express
 * @param app
 * @param express
 */
var configure = function(app, express) {

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