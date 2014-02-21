//var routes = require('../routes');

goog.provide('exp.urls');

goog.require('exp.routes');
goog.require('exp.userUrls');
goog.require('exp.orgsUrls');
goog.require('exp.urlMap');

exp.urls = function(app) {

  app.get('/data.php', exp.routes.debug);
  app.post('/data.php', exp.routes.debug);

  /** Index */
  app.get(exp.urlMap.INDEX, exp.routes.index);

  /** Home */
  app.get(exp.urlMap.BASIC.HOME, exp.routes.home);
  app.get(exp.urlMap.BASIC.INTRO, exp.routes.intro);
  app.get(exp.urlMap.BASIC.HEADER, exp.routes.header);
  app.post(exp.urlMap.BASIC.LOGOUT, exp.routes.logout);

  /** All other module urls */
  exp.userUrls(app);
  exp.orgsUrls(app);

  /** Catch all */
  app.get('*', exp.routes.four_oh_four);
};
