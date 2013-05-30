/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var settings = require('./etc/settings');
var WebSocketServer = require('ws').Server;
var Bridge = require('./src/bridge');

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

    var bridge = new Bridge(ws);
    var client = bridge.client;
    ws.bridge = bridge;

    //----------------------------------------------------------[ Web Socket ]--
    ws.on('open', function () {
        console.log('Web socket opened');
    });

    ws.on('close', function () {
        client.end();
        console.log('>>>>>Web socket closed<<<<<<');
    });

    ws.on('message', function (data) {
        var message = JSON.parse(data);
        switch(message.action) {
            case 'subscribe':
                if (message.topic && message.topic !== '') {
                    client.subscribe(message.topic, undefined, function() {
                        bridge.sendToWs(bridge.packageMqttForWs(
                            'Success',
                            'Subscribed to:' + message.topic)
                        );
                    });
                }
                break;
            case 'unsubscribe':
                if (message.topic && message.topic !== '') {
                    client.unsubscribe(message.topic, function() {
                        bridge.sendToWs(bridge.packageMqttForWs(
                            'Success',
                            'Un-subscribed from:' + message.topic)
                        );
                    });
                }
                break;
            case 'publish':
                client.publish(message.topic, message.payload, undefined,
                    function() {
                        bridge.sendToWs(bridge.packageMqttForWs(
                            'Success',
                            'Published:' + message.topic + ' :' + message.payload)
                        );
                    }
                );
                break;
            default:
                console.log('Unknow WS comms:', data);
        }
    });
});