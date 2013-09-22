var mqtt = require('mqtt');

goog.provide('exp.Bridge');

/**
 * @constructor
 */
exp.Bridge = function(ws, app) {
  this.ws = ws;
  this.id = this.ws.upgradeReq.headers['sec-websocket-key'];
  this.client = mqtt.createClient(
    app.get('mqttPort'),
    app.get('mqttServer'),
    {clientId: this.id}
  );
  this.initListeners();
};

exp.Bridge.prototype.getClient = function() {
  return this.client;
};

exp.Bridge.prototype.initListeners = function() {

  var messageCallback = goog.bind(function(topic, message) {
    this.sendToWs(this.packageMqttForWs('@received', topic,
      message)
    );
  }, this);
  this.client.on('message', messageCallback);

  var disconnectCallback = goog.bind(function(packet) {
    this.sendToWs(this.packageMqttForWs('@sys', 'Disconnect',
      'Disconnected from broker')
    );
  }, this);
  this.client.on('disconnect', disconnectCallback);

  var closeCallback = goog.bind(function() {
    this.sendToWs(this.packageMqttForWs('@sys', 'Close',
      'Closed connection to broker')
    );
  }, this);
  this.client.on('close', closeCallback);

  this.client.on('puback', function() {
    console.log('>>>>>>>>> PUBACK');
  });

  var errback = goog.bind(function(err) {
    this.sendToWs(this.packageMqttForWs('@sys', 'Error',
      err)
    );
  }, this);
  this.client.on('error', errback);
};

exp.Bridge.prototype.packageMqttForWs = function(target, topic, message) {
  return JSON.stringify({
    'target': target,
    'topic': topic,
    'message': message
  });
};

exp.Bridge.prototype.sendToWs = function(payload) {
  if (this.ws.readyState === 1) {
    this.ws.send(payload);
  } else {
    console.log('Socket not available to send:', payload);
  }
};

