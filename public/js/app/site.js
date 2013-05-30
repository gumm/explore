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
app.Site = function(wsServer, wsPort) {
    goog.events.EventHandler.call(this, this);

    this.wsServer = wsServer;
    this.wsPort = wsPort;

    this.webSocket = new goog.net.WebSocket(false);
    this.openWebsocket();
    this.initSite();
};
goog.inherits(app.Site, goog.events.EventHandler);

/**
 * Home page and landing page after login.
 */
app.Site.prototype.initSite = function() {

    var subscribe = goog.dom.getElement('subscrGo');
    this.listen(
        subscribe,
        goog.events.EventType.CLICK,
        function(e) {
            console.debug('Subscribe');
            var topic = document.getElementById('subscrIn').value;
            this.mqttSubscribe(topic);
        }, undefined, this);

    var publish = goog.dom.getElement('clickme');
    this.listen(
        publish,
        goog.events.EventType.CLICK,
        function(e) {
            console.debug('Click click');
            var topic = document.getElementById('topic').value;
            var payload = document.getElementById('payload').value;
            this.mqttPublish(topic, payload);
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
                    this.mqttPublish('Hello', 'Website came on-line');
                    break;
                case goog.net.WebSocket.EventType.MESSAGE:
                    this.routeWs(goog.json.parse(e.message));
                    break;
                case goog.net.WebSocket.EventType.CLOSED:
                    console.debug('CONNECTION CLOSED');
                    this.routeWs({
                        'target': '@sys',
                        'topic': 'Warning',
                        'message': 'Lost connection to server'
                    });
                    break;
                default:
                    console.debug('Did not understand this message type');
            }
        }
    );
    this.webSocket.open('ws://' + this.wsServer + ':' + this.wsPort +
        '/data/1234/');
};

app.Site.prototype.routeWs = function(data) {
    console.debug('DATA:', data);

    var target = data['target'];
    switch (target) {
        case '@received':
        case '@published':
            this.displayMQTT(target, data);
            break;
        case '@sys':
            this.displaySys(data);
            break;
        default:
            console.debug('Unknown target: ', target);
    }
};

app.Site.prototype.displaySys = function(data) {
    var orderdList = document.getElementById('in_sys');
    var li = goog.dom.createDom('li', {},
        goog.dom.createDom('code', 'muted', data['topic']),
        goog.dom.createDom('code', 'text-info',
            goog.dom.createDom('strong', {}, data['message']))
    );
    orderdList.appendChild(li);
};

app.Site.prototype.displayMQTT = function(target, data) {
    var pull = '';
    var col = 'text-warning';
    if(target === '@published') {
        pull = 'pull-right';
        col= 'text-success';
    }
    var orderdList = document.getElementById('in_mqtt');
    var li = goog.dom.createDom('li', {},
        goog.dom.createDom('span', pull,
            goog.dom.createDom('code', 'muted', data['topic']),
            goog.dom.createDom('code', col,
                goog.dom.createDom('strong', {}, data['message']))
        )
    );
    orderdList.appendChild(li);
};

app.Site.prototype.mqttPublish = function(topic, payload) {
    this.webSocket.send(goog.json.serialize({
        'action': 'publish',
        'topic': topic,
        'payload': payload
    }));
};

app.Site.prototype.mqttSubscribe = function(topic) {
    this.webSocket.send(goog.json.serialize({
        'action': 'subscribe',
        'topic': topic
    }));
};
