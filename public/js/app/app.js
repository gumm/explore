goog.provide('app');

goog.require('app.Site');
goog.require('goog.dom');


/**
 * Init the site
 */
app.initSite = function() {

    /**
     * @type {app.Site}
     */
    var site = new app.Site();
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
