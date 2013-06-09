var pjson = require('../../package.json');
var path = require('path');
var urls = require('../urls/urls').urls;
var ExploreMongoDB = require('../src/mongodbserver');
var root = path.resolve(__dirname, '../../');
var appPath = path.resolve(__dirname, '../');


/**
 * Site specific configuration.
 * @type {Object}
 */
var conf = {
    path: {
        ROOT: root,
        VIEWS: path.join(appPath, 'views'),
        PUBLIC: path.join(appPath, 'public'),
        DEPS: path.join('js', 'deps.js'),
        PAHO: path.join('js', 'lib/mqttws31.js'),
        BOOTSTRAP: path.join('js', 'bootstrap.js'),
        GOOG: path.join('js', 'closure-library/closure/goog/base.js'),
        CSS: path.join('css', 'default.css'),
        FAVICON: path.join(appPath, 'public/img/favicon.ico'),
        COMPILED: {
            JS: path.join('js',
                'compiled/' + pjson.name + '_' + pjson.version + '.js'),
            CSS: path.join('css',
                'compiled/' + pjson.name + '_' + pjson.version + '.css')
        }
    },
    engine: 'jade',
    production: true,
    compiled: {
        JS: false,
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
exports.configure = function(app, express, dev) {

    // Set some stuff up
    init(dev);

    // Set up the database interaction.
    var mongo = new ExploreMongoDB();

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
        .set('jsCompiled', conf.path.COMPILED.JS)
        .set('cssCompiled', conf.path.COMPILED.CSS)
        .set('mongo', mongo);

    // Middle-ware
    app.use(express.favicon(conf.path.FAVICON));
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({ secret: 'super-duper-secret-secret' }));
    app.use(express.static(conf.path.PUBLIC));

    // Development only
    if ('development' === app.get('env')) {
        app.use(express.errorHandler());
        app.use(express.logger('dev'));  // 'default', 'short', 'tiny', 'dev'
    } else {
        app.use(express.logger('default'));
    }

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

    // Set up the app urls.
    urls(app);
};
