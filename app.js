/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var settings = require('./etc/settings');
var WebSocketServer = require('ws').Server;

/**
 * App Setup
 */
var app = express();
settings.configure(app, express);

/**
 * Server Setup
 * @type {*|http.Server|http.Server|goog.events.Key}
 */
var server = http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

/**
 * Socket Server Setup
 * @type {WebSocketServer}
 */
var wss = new WebSocketServer({server: server});
wss.on('connection', function (ws) {

    var clientId = ws.upgradeReq.headers['sec-websocket-key'];

    // Each socket becomes a mqtt client.
    var mqtt = require('mqtt');
    var client = mqtt.createClient(1883, '54.229.30.67', {clientId: clientId});

    // This subscribes to all messages.
    client.subscribe('#');

    // This delivers everything that was subscribed to.
    client.on('message', function (topic, message) {
        var mqttMessage = JSON.stringify({'topic':topic, 'message':message});
        console.log('client received message:', mqttMessage);
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