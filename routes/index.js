/*
 * GET home page.
 */

exports.index = function (req, res) {
    var app = req.app;

    res.render('index', {
        jsIsCompiled: app.enabled('jsIsCompiled'),
        title: app.get('title'),
        jsCompiled: app.get('jsCompiled'),
        cssBasic: app.get('cssBasic'),
        cssCompiled: app.get('cssCompiled'),
        googScript: app.get('goog'),
        deps: app.get('deps'),
        bootstrap: app.get('bootstrap'),
        wsPort: app.get('wsPort'),
        wsServer: app.get('wsServer')
    });
};