/**
 * @fileoverview Base scripts for initialising the app site.
 */
goog.provide('app.Site');

goog.require('goog.events.EventHandler');
goog.require('goog.json');
goog.require('goog.net.WebSocket');
goog.require('goog.net.WebSocket.EventType');
goog.require('goog.ui.Css3ButtonRenderer');
goog.require('goog.ui.CustomButton');

/**
 * Constructor of the main site object.
 * @extends {goog.events.EventHandler}
 * @constructor
 */
app.Site = function() {
    goog.events.EventHandler.call(this, this);
    console.debug('app.Site: Here we go');

    this.webSocket = new goog.net.WebSocket(false);
    this.openWebsocket();
    this.initSite();
};
goog.inherits(app.Site, goog.events.EventHandler);

/**
 * Home page and landing page after login.
 */
app.Site.prototype.initSite = function() {

    var button = new goog.ui.CustomButton('Button',
        goog.ui.Css3ButtonRenderer.getInstance());
    button.render(goog.dom.getElement('clickme'));
    this.listen(
        button,
        goog.ui.Component.EventType.ACTION,
        function(e) {
            console.debug('Pres me - hahaha');
            var topic = document.getElementById('topic').value;
            var payload = document.getElementById('payload').value;
            this.mqttSend(topic, payload);
        }, undefined, this);
};

app.Site.prototype.openWebsocket = function() {
    this.listen(
        this.webSocket,
        [
            goog.net.WebSocket.EventType.OPENED,
            goog.net.WebSocket.EventType.MESSAGE,
            goog.net.WebSocket.EventType.CLOSED
        ],
        function(e) {
            switch (e.type) {
                case goog.net.WebSocket.EventType.OPENED:
                    console.debug('CONNECTION OPENED');
                    this.mqttSend('/gumm', 'Website came online');
                    break;
                case goog.net.WebSocket.EventType.MESSAGE:
                    this.mqttRead(goog.json.parse(e.message));
                    break;
                case goog.net.WebSocket.EventType.CLOSED:
                    console.debug('CONNECTION CLOSED');
                    break;
                default:
                    console.debug('Did not understand this message type');
            }
        }
    );
    this.webSocket.open('ws://localhost:3000/data/1234/');
};

app.Site.prototype.mqttRead = function(data) {
    console.debug('Data ', data);
    var topic = document.getElementById('in_topic');
    var payload = document.getElementById('in_payload');

    topic.innerText = data['topic'];
    payload.innerText = data['message'];
};

app.Site.prototype.mqttSend = function(topic, payload) {
    this.webSocket.send(goog.json.serialize({
        'topic': topic,
        'payload': payload
    }));
};
