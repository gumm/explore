var mqtt = require('mqtt');

/**
 * This is a
 * @constructor
 */
var Bridge = function(ws, app) {
    this.ws = ws;
    this.id = this.ws.upgradeReq.headers['sec-websocket-key'];
    this.client = mqtt.createClient(
        app.get('mqttPort'),
        app.get('mqttServer'),
        {clientId: this.id}
    );
    this.initListeners();
};

Bridge.prototype.getClient = function() {
    return this.client;
};

Bridge.prototype.initListeners = function() {
    // This delivers everything that was subscribed to.

    var messageCallback = (function(topic, message) {
        this.sendToWs(this.packageMqttForWs(
            '@received',
            topic,
            message)
        );
    }).bind(this);
    this.client.on('message', messageCallback);

    var disconnectCallback = (function(packet) {
        this.sendToWs(this.packageMqttForWs(
            '@sys',
            'Disconnect',
            'Disconnected from broker')
        );
    }).bind(this);
    this.client.on('disconnect', disconnectCallback);

    var closeCallback = (function() {
        this.sendToWs(this.packageMqttForWs(
            '@sys',
            'Close',
            'Closed connection to broker')
        );
    }).bind(this);
    this.client.on('close', closeCallback);

    this.client.on('puback', function(){
        console.log('>>>>>>>>> PUBACK');
    });

    var errorCallback = (function(err) {
        this.sendToWs(this.packageMqttForWs(
            '@sys',
            'Error',
            err)
        );
    }).bind(this);
    this.client.on('error', errorCallback);
};

Bridge.prototype.packageMqttForWs = function(target, topic, message) {
    return JSON.stringify({
        'target': target,
        'topic':topic,
        'message':message
    });
};

Bridge.prototype.sendToWs = function(payload) {
    if (this.ws.readyState === 1) {
        this.ws.send(payload);
    } else {
        console.log('Socket not available to send:', payload);
    }
};

/**
 * Expose `Bridge`.
 */
module.exports = Bridge;

