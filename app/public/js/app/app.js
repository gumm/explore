goog.provide('app');

goog.require('app.Site');
goog.require('goog.dom');
goog.require('goog.net.XhrManager');


/**
 * Init the site
 */
app.initSite = function() {

    var opt_maxRetries = 0,
        opt_headers = null,
        opt_minCount = 1,
        opt_maxCount = 6,
        opt_timeoutInterval = 0;

    var xMan = new goog.net.XhrManager(
        opt_maxRetries,
        opt_headers,
        opt_minCount,
        opt_maxCount,
        opt_timeoutInterval);


    /**
     * @type {app.Site}
     */
    var site = new app.Site(xMan);
    site.initSite();
    goog.exportSymbol('debugSite', site);
};


/**
 * @type {Object}
 * @private
 */
app.init_ = {
    'site': app.initSite
};
goog.exportSymbol('app_', app.init_);