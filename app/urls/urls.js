//var routes = require('../routes');

goog.provide('exp.urls');

goog.require('exp.routes');
goog.require('exp.userUrls');
goog.require('exp.orgsUrls');
goog.require('exp.urlMap');

exp.urls = function(app) {

    /** Index */
    app.get(    exp.urlMap.INDEX,   exp.routes.index);

    /** Home */
    app.get(    exp.urlMap.HOME,    exp.routes.home);

    /** All other module urls */
    exp.userUrls(app);
    exp.orgsUrls(app);

    /** Catch all */
    app.get('*', exp.routes.four_oh_four);
};
