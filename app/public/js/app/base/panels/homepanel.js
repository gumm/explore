goog.provide('app.base.panel.Home');

goog.require('bad.MqttEventType');
goog.require('bad.ui.Panel');
goog.require('goog.json');

/**
 * The home panel.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {bad.ui.Panel}
 * @constructor
 */
app.base.panel.Home = function(opt_domHelper) {
  bad.ui.Panel.call(this, opt_domHelper);
};
goog.inherits(app.base.panel.Home, bad.ui.Panel);

app.base.panel.Home.prototype.setMqtt = function(mqtt) {
  this.mqtt = mqtt;
};

app.base.panel.Home.prototype.enterDocument = function() {
  this.dom_ = goog.dom.getDomHelper(this.getElement());

  console.debug('Homepanel Entered Document');

  this.mqtt.mqttUnSubscribe('/owntracks/+/+');
  this.mqtt.mqttSubscribe('/owntracks/+/+');

  if (this.dom_.getElement('mapCanvas')) {
//    bad.utils.loadGoogleMaps(goog.bind(this.renderMap, this));
//    L.mapbox.map('mapCanvas', 'gumm.idfb094f');
    this.renderMapBox();
  }
  app.base.panel.Home.superClass_.enterDocument.call(this);
};


/**
 * Once google maps is available this is the callback to execute.
 * @param {string=} opt_randName
 */
app.base.panel.Home.prototype.renderMapBox = function() {

  console.debug('HERE IS THE USER THEME:', this.getUser().getTheme())

  var map = L.mapbox.map('mapCanvas', this.getUser().getTheme()).setZoom(2);
  var marker = L.marker([0, 0]).addTo(map);

  var setPosition = function(payload) {
    var latLng = L.latLng(payload['lat'], payload['lon']);
    console.debug('Setting position:', latLng);
    marker.setLatLng(latLng);
    map.panTo(latLng);
  };

  this.getHandler().listen(
    this.mqtt,
    'owntracks/jan/phone',
    function(e) {
      setPosition(goog.json.parse(e.payload));
    }
  );
};


/**
 * Once google maps is available this is the callback to execute.
 * @param {string=} opt_randName
 */
app.base.panel.Home.prototype.renderMap = function(opt_randName) {
  if (goog.global[opt_randName]) {
    delete goog.global[opt_randName];
  }

  var latLng = new google.maps.LatLng(0, 0);
  var map = new google.maps.Map(document.getElementById('mapCanvas'), {
    zoom: 15,
    center: latLng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  var marker = new google.maps.Marker({
    position: latLng,
    title: 'Point A',
    map: map,
    draggable: true
  });

  var setPosition = function(payload) {
    latLng = new google.maps.LatLng(payload['lat'], payload['lon']);
    marker.setPosition(latLng);
    map.setCenter(latLng);
  };

  this.getHandler().listen(
    this.mqtt,
    'owntracks/jan/phone',
    function(e) {
      setPosition(goog.json.parse(e.payload));
    }
  );
};