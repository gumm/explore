goog.provide('app');

goog.require('app.Site');
goog.require('goog.dom');


/**
 * Init the site
 * @param {Object.<string, boolean>} permissions A permissions string that
 *      can be parsed as JSON object.
 * @param {Object.<string, (string|number|boolean)>} user A user string that
 *      can be parsed as JSON object.
 * @param {!string} landing The page the site should open on.
 * @param {!string} theme The name of the site theme.
 */
app.initSite = function(permissions, user, landing, theme) {

    /**
     * @type {app.Site}
     */
    var site = new app.Site();

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
