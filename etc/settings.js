var pjson = require('../package.json');
var path = require('path');
var urls = require('../src/urls');
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
        LIB: path.join(root, 'lib'),
        DEPS: path.join('js', 'deps.js'),
        PAHO: path.join('js', 'lib/mqttws31.js'),
        BOOTSTRAP: path.join('js', 'bootstrap.js'),
        GOOG: path.join('js', 'closure-library/closure/goog/base.js'),
        CSS: path.join('css', 'default2.css'),
        compiled: {
            JS: path.join('js',
                'compiled/' + pjson.name + '_' + pjson.version + '.js'),
            CSS: path.join('css',
                'compiled/' + pjson.name + '_' + pjson.version + '.css')
        }
    },
    engine: 'jade',
    production: true,
    compiled: {
        JS: true,
        CSS: false
    }
};

/**
 * Seed the conf with a root directory
 * @param {boolean} dev True if this is dev run
 */
var init = function(dev) {
    // Switch between production and development
    if (dev) {
        conf.production = false;
        conf.mqttServer = '54.229.30.67';
        conf.mqttPort = 1883;
        conf.wsServer = 'localhost';
        conf.wsPort = process.env.PORT || 3000;
        conf.port = process.env.PORT || 3000;
    } else {
        conf.production = true;
        conf.mqttServer = '54.229.30.67';
        conf.mqttPort = 1883;
        conf.wsServer = '54.229.30.67';
        conf.wsPort = 80;
        conf.port = 80;
    }
};

/**
 * Configure the app, and express
 * @param app
 * @param express
 * @param {boolean} dev True if this is a dev run
 */
var configure = function(app, express, dev) {

    // Set some stuff up
    init(dev);

    // all environments
    app.set('port', conf.port)
        .set('views', conf.path.VIEWS)
        .set('view engine', conf.engine)
        .set('mqttServer', conf.mqttServer)
        .set('mqttPort', conf.mqttPort)
        .set('wsServer', conf.wsServer)
        .set('wsPort', conf.wsPort)
        .set('goog', conf.path.GOOG)
        .set('paho', conf.path.PAHO)
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

    // Development only
    if ('development' === app.get('env')) {
        app.use(express.errorHandler());
    }

    // Set up the app urls directories
    urls.configure(app);
};

module.exports.init = init;
module.exports.configure = configure;