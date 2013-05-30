var mqtt = require('mqtt');

/**
 * This is a
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

    var messageCallback = (function(topic, message) {
        console.log('>>>>>  messageCallback');
        this.sendToWs(this.packageMqttForWs(
            topic,
            message)
        );
    }).bind(this);
    this.client.on('message', messageCallback);

    var disconnectCallback = (function(packet) {
        console.log('>>>>> disconnectCallback');
        this.sendToWs(this.packageMqttForWs(
            'Disconnect',
            'Disconnected from broker')
        );
    }).bind(this);
    this.client.on('disconnect', disconnectCallback);

    var closeCallback = (function() {
        console.log('>>>>>  closeCallback');
        this.sendToWs(this.packageMqttForWs(
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
            'Error',
            err)
        );
    }).bind(this);
    this.client.on('error', errorCallback);
};

Bridge.prototype.packageMqttForWs = function(topic, message) {
    return JSON.stringify({mqtt:{'topic':topic, 'message':message}});
};

Bridge.prototype.sendToWs = function(payload) {
    if (this.ws.readyState === 1) {
        this.ws.send(payload, function() {
            console.log('WS Send disappeared halfway through send');
        });
    }
};

/**
 * Expose `Bridge`.
 */
module.exports = Bridge;

