var mqtt = require('mqtt');
var goog = require('../lib/goog');

console.log(goog);

/**
 * @constructor
 */
Bridge = function(ws) {
    this.ws = ws;
    this.id = this.ws.upgradeReq.headers['sec-websocket-key'];
    this.client = mqtt.createClient(1883, '54.229.30.67', {clientId: this.id});
    this.initListeners();
};

Bridge.prototype.getClient = function() {
    return this.client;
};

Bridge.prototype.initListeners = function() {
    // This delivers everything that was subscribed to.

    var messageCallback = goog.bind(function(topic, message) {
        console.log('Client receive:', topic, message);
        console.log('WS Send:', this.packageMqttForWs(topic, message));
        this.sendToWs(this.packageMqttForWs(
            topic,
            message)
        );
    }, this);
    this.client.on('message', messageCallback);

    var disconnectCallback = goog.bind(function(packet) {
        console.log('Client disconnect', packet);
        this.sendToWs(this.packageMqttForWs(
            'Disconnect',
            'Disconnected from broker')
        );
    }, this);
    this.client.on('disconnect', disconnectCallback);

    var closeCallback = goog.bind(function(err) {
         console.log('Client close', err);
        this.sendToWs(this.packageMqttForWs(
            'Close',
            'Closed connection to broker')
        );
    }, this);
    this.client.on('close', closeCallback);

    this.client.on('puback', function(){
        console.log('>>>>>>>>> PUBACK');
    });

    var errorCallback = goog.bind(function(err) {
        console.log('Client error', err);
        this.sendToWs(this.packageMqttForWs(
            'Error',
            err)
        );
    }, this);
    this.client.on('error', errorCallback);
};

Bridge.prototype.packageMqttForWs = function(topic, message) {
    return JSON.stringify({mqtt:{'topic':topic, 'message':message}});
};

Bridge.prototype.sendToWs = function(payload) {
    this.ws.send(payload, function(e) {
        console.log('WS Send failed:', e);
    });
};

/**
 * Expose `Bridge`.
 */
module.exports = Bridge;

