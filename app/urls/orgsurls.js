goog.provide('exp.orgsUrls');

goog.require('exp.routes.orgs');
goog.require('exp.urlMap');

exp.orgsUrls = function(app) {

    var route = exp.routes.orgs;

    app.get(    exp.urlMap.ORGS.CREATE,                     route.create);
    app.post(   exp.urlMap.ORGS.CREATE,                     route.create);

    app.get(    exp.urlMap.ORGS.READ,                       route.read);
    app.get(    exp.urlMap.ORGS.READ + '/:id',              route.read);

    app.get(    exp.urlMap.ORGS.UPDATE + '/:id/:subset',    route.update);
    app.post(   exp.urlMap.ORGS.UPDATE + '/:id/:subset',    route.update);

    app.get(    exp.urlMap.ORGS.DELETE + '/:id',            route.delete);
    app.del(    exp.urlMap.ORGS.DELETE + '/:id',            route.delete);
};
