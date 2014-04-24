goog.provide('exp.avUrls');

goog.require('exp.routes.av');
goog.require('exp.urlMap');

exp.avUrls = function(app) {

  var route = exp.routes.av;

  app.get(exp.urlMap.AV.API, route.apiExpore);

  app.get(exp.urlMap.AV.USER.ALL, route.basic);
  app.get(exp.urlMap.AV.USER.DETAIL, route.basic);
  app.get(exp.urlMap.AV.USER.CURRENT, route.basic);
  app.get(exp.urlMap.AV.USER.PICTURE_NORMAL, route.binary);
  app.get(exp.urlMap.AV.USER.PICTURE_SMALL, route.binary);
  app.get(exp.urlMap.AV.USER.PICTURE_ICON, route.binary);
  app.get(exp.urlMap.AV.USER.RIGHTS, route.basic);
  app.get(exp.urlMap.AV.USER.CLIENTS, route.basic);

};
