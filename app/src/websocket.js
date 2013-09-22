/**
 * Created with PyCharm.
 * User: gumm
 * Date: 2013/06/02
 * Time: 11:16 AM
 * To change this template use File | Settings | File Templates.
 */

var WebSocketServer = require('ws').Server;

goog.require('exp.Bridge');

goog.provide('exp.WebSocket');

/**
 * @param server
 * @param app
 * @constructor
 */
exp.WebSocket = function(server, app) {
  /**
   * Socket Server Setup
   * @type {WebSocketServer}
   */
  this.wss = new WebSocketServer({server: server});
  this.init(app);
};

exp.WebSocket.prototype.init = function(app) {

  console.log('Web Socket server is up...');

  //----------------------------------------------------------[ Web Socket ]--
  this.wss.on('connection', function(ws) {
    ws.bridge = new exp.Bridge(ws, app);
    var client = ws.bridge.getClient();

    ws.on('open', function() {
      console.log('Web socket opened');
    });

    ws.on('close', function() {
      client.end();
      console.log('>>>>>Web socket closed<<<<<<');
    });

    ws.on('message', function(data) {
      var message = JSON.parse(data);
      switch (message.action) {
        case 'subscribe':
          if (message.topic && message.topic !== '') {
            client.subscribe(message.topic, undefined, function() {
              ws.bridge.sendToWs(ws.bridge.packageMqttForWs(
                '@sys',
                'Subscribed to',
                message.topic)
              );
            });
          }
          break;
        case 'unsubscribe':
          if (message.topic && message.topic !== '') {
            client.unsubscribe(message.topic, function() {
              ws.bridge.sendToWs(ws.bridge.packageMqttForWs(
                '@sys',
                'Un-subscribed from',
                message.topic)
              );
            });
          }
          break;
        case 'publish':
          client.publish(message.topic, message.payload, undefined,
            function() {
              ws.bridge.sendToWs(ws.bridge.packageMqttForWs(
                '@published',
                message.topic,
                message.payload)
              );
            }
          );
          break;
        default:
          console.log('Unknow WS comms:', data);
      }
    });
  });
};