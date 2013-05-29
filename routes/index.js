/*
 * GET home page.
 */

exports.index = function (req, res) {
    var app = req.app;

    var settings = {
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
        wsServer: app.get('wsServer')
    };
    console.log(settings);

    res.render('index', {
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
        wsServer: app.get('wsServer')
    });
};