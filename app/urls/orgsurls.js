goog.provide('exp.orgsUrls');

goog.require('exp.routes.orgs');
goog.require('exp.urlMap');

exp.orgsUrls = function(app) {

    var route = exp.routes.orgs;

    app.get(exp.urlMap.ORGS.CREATE, route.create);
    app.post(exp.urlMap.ORGS.CREATE, route.create);

    app.get(exp.urlMap.ORGS.READ, route.list);
    app.get(exp.urlMap.ORGS.READ + ':id', route.getById);

    app.get(exp.urlMap.ORGS.UPDATE + ':id', route.edit);
    app.put(exp.urlMap.ORGS.UPDATE + ':id', route.edit);

    app.get(exp.urlMap.ORGS.DELETE + ':id', route.delete);
    app.del(exp.urlMap.ORGS.DELETE + ':id', route.delete);
};
