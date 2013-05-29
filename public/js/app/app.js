goog.provide('app');

goog.require('app.Site');
goog.require('goog.dom');


/**
 * Init the site
 */
app.initSite = function(wsServer, wsPort) {

    /**
     * @type {app.Site}
     */
    var site = new app.Site(wsServer, wsPort);

    /**
     * @enum {Function}
     */
    var landingView = {
        'core': goog.bind(site.initSite, site)
    };
};

/**
 * @type {Object}
 * @private
 */
app.init_ = {
    'site': app.initSite
};
goog.exportSymbol('app_', app.init_);
