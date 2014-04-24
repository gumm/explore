goog.provide('exp.avUrls');

goog.require('exp.routes.av');
goog.require('exp.urlMap');

exp.avUrls = function(app) {

  var route = exp.routes.av;

  app.get(exp.urlMap.AV.USER.FIND, route.basic);
  app.get(exp.urlMap.AV.USER.FIND + '/:uid', route.basic);
  app.get(exp.urlMap.AV.USER.FIND + '/:uid/picture/:name', route.binary);
  app.get(exp.urlMap.AV.USER.CURRENT, route.basic);
  app.get(exp.urlMap.AV.USER.RIGHTS, route.basic);

};
