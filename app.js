/**
 * Module dependencies.
 */

var pjson = require('./package.json');
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var WebSocketServer = require('ws').Server;

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// To change between compiled and un-compiled mode
// use enable or disable.
app.enable('jsIsCompiled');

// Basic app defaults
app.set('title', pjson.name);
app.set('version', pjson.version);

// Compiled settings
app.set('jsCompiled',
    '/js/compiled/' + pjson.name + '_' + pjson.version + '.js');
app.set('cssCompiled',
    '/css/compiled/'+ pjson.name + '_' + pjson.version + '.css');

// Normal Settings
app.set('closureBase', '/js/closure-library/closure/goog/base.js');
app.set('deps', '/js/deps.js');
app.set('bootstrap', '/js/bootstrap.js');
app.set('cssBasic', '/css/default.css');

// Middleware
app.use(express.compress());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

var server = http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

// A Web Socket server
var wss = new WebSocketServer({server: server});
wss.on('connection', function (ws) {

    var clientId = ws.upgradeReq.headers['sec-websocket-key'];
    console.log(ws.upgradeReq.url);

    // Each socket is becomes a mqtt client.
    var mqtt = require('mqtt');
    var client = mqtt.createClient(1883, 'localhost', {clientId: clientId});

    // This subscribes to all messages.
    client.subscribe('#');

    // This delivers everything that was subscribed to.
    client.on('message', function (topic, message) {
        var mqttMessage = JSON.stringify({'topic':topic, 'message':message});
        console.log(mqttMessage);
        ws.send(mqttMessage);
    });

    ws.on('close', function () {
        client.end();
        console.log('stopping client interval');
    });

    ws.on('message', function (data) {
        var message = JSON.parse(data);
        console.log('topic: %s', message.topic);
        console.log('payload: %s', message.payload);
        client.publish(message.topic, message.payload);
    });
});