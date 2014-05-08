goog.provide('exp.routesHelper');

/**
 * A generic reply object.
 * @param {?(Object|string)=} opt_err
 * @param {?(Object|string)=} opt_data
 * @param {?string=} opt_message
 * @returns {{error: (*|null), data: (*|null), message: (*|null)}}
 */
exp.routesHelper.makeReplyWith = function(opt_err, opt_data, opt_message) {
  return {
    error: opt_err || null,
    data: opt_data || null,
    message: opt_message || null
  };
};

exp.routesHelper.notSupported = function(res) {
  res.send('Method Not Allowed', 405);
};

exp.routesHelper.okGo = function(req, res, obj) {
  if (obj[req.method]) {
    obj[req.method]();
  } else {
    exp.routesHelper.notSupported(res);
  }
};

exp.routesHelper.getBasicSetup = function(req) {
  var app = req.app;

  return {
    jsIsCompiled: app.enabled('jsIsCompiled'),
    cssIsCompiled: app.enabled('cssIsCompiled'),
    title: app.get('title'),
    jsCompiled: app.get('jsCompiled'),
    cssBasic: app.get('cssBasic'),
    cssCompiled: app.get('cssCompiled'),
    goog: app.get('goog'),
    deps: app.get('deps'),
    bootstrap: app.get('bootstrap'),
    wsPort: app.get('wsPort'),
    wsServer: app.get('wsServer'),
    landing: null
  };
};