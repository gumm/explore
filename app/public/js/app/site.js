/**
 * @fileoverview The top level app. From here the views are controlled.
 */
goog.provide('app.Site');

goog.require('app.base.view.Home');
goog.require('app.base.view.Persistent');
goog.require('app.doMap');
goog.require('app.org.view.Org');
goog.require('app.user.view.Account');
goog.require('app.user.view.Login');
goog.require('bad.UserManager');
goog.require('bad.ui.EventType');
goog.require('bad.ui.Layout');
goog.require('bad.utils');
goog.require('exp.urlMap');
goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.events.EventHandler');


/**
 * Constructor of the main site object. Inherits from EventHandler, so it
 * can simply subscribe to events on its children.
 * @param {!bad.Net} xManWrapper This site's XhrManager wrapped in a bad.Net
 *      convenience wrapper.
 * @param {bad.MqttWsIo} mqtt A mqtt web-socket implementation.
 * @constructor
 * @extends {goog.events.EventHandler}
 */
app.Site = function(xManWrapper, mqtt, opt_landing) {
  goog.events.EventHandler.call(this);

  /**
   * @type {!bad.Net}
   */
  this.xMan_ = xManWrapper;

  /**
   * @type {bad.MqttWsIo}
   */
  this.mqtt = mqtt;

  /**
   * @type {bad.ui.Layout}
   * @private
   */
  this.layout_ = null;

  /**
   * @type {bad.UserManager}
   * @private
   */
  this.user_ = new bad.UserManager(this.xMan_);

  this.landing = opt_landing ? opt_landing : app.doMap.AUTO;
};
goog.inherits(app.Site, goog.events.EventHandler);

/**
 * Home page and landing page after login.
 */
app.Site.prototype.initSite = function() {
  this.initLayout_();
};

app.Site.prototype.rpc = function(method, opt_param) {

  switch (method) {
    case app.doMap.VIEW_EDIT_USER:
      this.viewEditUser(opt_param);
      break;
    case app.doMap.USER_LOGGED_IN:
      this.userSignedIn();
      break;
    case app.doMap.VIEW_LOGIN:
      this.viewLogin();
      break;
    case app.doMap.RESET_PASSWORD:
      this.viewResetPassword();
      break;
    case app.doMap.AUTO:
      this.autoLogin();
      break;
    case app.doMap.VIEW_HOME:
      this.viewHome();
      break;
    case app.doMap.VIEW_ORG_CREATE:
      this.viewOrgCreate();
      break;
    case app.doMap.VIEW_ORG:
      this.viewOrg(opt_param);
      break;
    case app.doMap.SWAP_THEME:
      this.swapTheme(opt_param);
      break;
    case app.doMap.NESTS_SLIDE_CLOSE_ALL:
      this.slideAllNestsClosed(opt_param);
      break;
    case app.doMap.NESTS_HIDE_ALL:
      this.hideAllNests(opt_param);
      break;
    default:
      console.log('Switch fall through for: ', method, opt_param);
  }
};

/**
 * Create the layout component.
 * @private
 */
app.Site.prototype.initLayout_ = function() {

  var id = 'blee';
  var mainCells = ['header', 'main', 'footer'];
  var innerCellsHorizontal = ['left', 'center', 'right'];
  var innerCellsVertical = ['top', 'mid', 'bottom'];
  var topMargin = 0;
  var rightMargin = 0;
  var bottomMargin = 0;
  var leftMargin = 0;

  /**
   * Create a new layout
   * @type {bad.ui.Layout}
   * @private
   */
  this.layout_ = new bad.ui.Layout(id, mainCells,
    bad.ui.Layout.Orientation.VERTICAL
  );

  // Set the defaults for the site.
  this.layout_.setTarget(goog.dom.getDocument().body);
  this.layout_.setInitialSize(mainCells[0], 0);
  this.layout_.setInitialSize(mainCells[2], 72);
  this.layout_.setDraggerThickness(0);
  this.layout_.setWidthToViewport(true);
  this.layout_.setHeightToViewport(true);
  this.layout_.setMargin(topMargin, rightMargin, bottomMargin, leftMargin);

  /**
   * Create main horizontal layout.
   * @type {bad.ui.Layout}
   */
  var mainHorizontalLayout = this.layout_.setInnerLayout(
    innerCellsHorizontal,
    mainCells[1],
    bad.ui.Layout.Orientation.HORIZONTAL
  );
  mainHorizontalLayout.setDraggerThickness(5);
  mainHorizontalLayout.setInitialSize(innerCellsHorizontal[0], 220);
  mainHorizontalLayout.setInitialSize(innerCellsHorizontal[2], 220);

  /**
   * Up-Down Layout in the left.
   * @type {bad.ui.Layout}
   */
  var leftVerticalLayout = mainHorizontalLayout.setInnerLayout(
    innerCellsVertical,
    innerCellsHorizontal[0],
    bad.ui.Layout.Orientation.VERTICAL
  );
  leftVerticalLayout.setInitialSize(innerCellsVertical[0], 50);
  leftVerticalLayout.setInitialSize(innerCellsVertical[2], 50);

  /**
   * Up-Down Layout in the center.
   * @type {bad.ui.Layout}
   */
  var centerVerticalLayout = mainHorizontalLayout.setInnerLayout(
    innerCellsVertical,
    innerCellsHorizontal[1],
    bad.ui.Layout.Orientation.VERTICAL
  );
  centerVerticalLayout.setInitialSize(innerCellsVertical[0], 50);
  centerVerticalLayout.setInitialSize(innerCellsVertical[2], 50);

  /**
   * Up-Down Layout in the right.
   * @type {bad.ui.Layout}
   */
  var rightVerticalLayout = mainHorizontalLayout.setInnerLayout(
    innerCellsVertical,
    innerCellsHorizontal[2],
    bad.ui.Layout.Orientation.VERTICAL
  );
  rightVerticalLayout.setInitialSize(innerCellsVertical[0], 50);
  rightVerticalLayout.setInitialSize(innerCellsVertical[2], 50);

  /**
   * Each if the internal layouts will fire a LAYOUT_READY event, and all
   * of those events bubble to this_layout_. Only when all the internal
   * layouts are ready, does this.layout_ fire its LAYOUT_READY event.
   * So if we just want to react the this.layout_, then we need to
   * check the target id of all events, and simply act when it is the same
   * as this.layout_'s id.
   */
  this.listen(
    this.layout_,
    bad.ui.Layout.EventType.LAYOUT_READY,
    function(e) {
      if (e.target.getId() === id) {
        this.nests = [
          this.layout_.getNest('main', 'left'),
          this.layout_.getNest('main', 'left', 'top'),
          this.layout_.getNest('main', 'left', 'bottom'),
          this.layout_.getNest('main', 'center', 'top'),
          this.layout_.getNest('main', 'center', 'bottom'),
          this.layout_.getNest('main', 'right'),
          this.layout_.getNest('main', 'right', 'top'),
          this.layout_.getNest('main', 'right', 'bottom')
        ];
        this.hideAllNests();
        this.rpc(this.landing);
      }
    }
  );

  // Create the layout in the DOM
  this.layout_.render();
//  this.renderMapBox();

};

//------------------------------------------------------------------[ Header ]--

/**
 * Some stuff should stay in the header as long as the user is signed in.
 * It should only appear on sign-in, and be destroyed on sign out.
 * This uses a special view with its own panel components to dive this.
 */
app.Site.prototype.initHeader = function() {

  /**
   * @type {app.base.view.Persistent}
   * @private
   */
  this.persistentView_ = new app.base.view.Persistent(this.mqtt);
  this.persistentView_.setLayout(this.layout_);
  this.persistentView_.setXMan(this.xMan_);
  this.persistentView_.setUser(this.user_);
  this.persistentView_.render();
  this.listen(
    this.persistentView_, bad.ui.EventType.APP_DO, this.onApDo);

};

//-------------------------------------------------------------------[ Login ]--

app.Site.prototype.autoLogin = function() {
  var onSuccess = goog.bind(this.userSignedIn, this);
  var onFail = goog.bind(this.viewLogin, this);
  this.user_.autoLogin(onSuccess, onFail);
};

/**
 * Called when a user signed in successfully.
 */
app.Site.prototype.userSignedIn = function() {
  goog.dom.classes.add(goog.dom.getElement('body-background'), 'noimg');
  this.initHeader();
  this.viewHome();
};

//---------------------------------------------------------[ Views Utilities ]--

/**
 * @param {bad.ui.View} view
 */
app.Site.prototype.switchView = function(view) {
    if (this.activeView_) {
      this.activeView_.dispose();
    }
    this.activeView_ = view;
    this.activeView_.setLayout(this.layout_);
    this.activeView_.setXMan(this.xMan_);
    this.activeView_.setUser(this.user_);
    this.activeView_.setMqtt(this.mqtt);
    this.activeView_.render();
    if (this.persistentView_) {
      this.persistentView_.setActiveView(this.activeView_);
    }
    this.listen(
      this.activeView_, bad.ui.EventType.APP_DO, this.onApDo);
};

/**
 * @param {goog.events.EventLike} e Event object.
 */
app.Site.prototype.onApDo = function(e) {
  var method = e.data.method;
  var param = e.data.param;
  e.stopPropagation();
  this.rpc(method, param);
};

//-------------------------------------------------------------------[ Views ]--

/**
 *
 */
app.Site.prototype.viewLogin = function() {

  /**
   * @type {app.user.view.Login}
   */
  var view = new app.user.view.Login();
  this.switchView(view);
};

app.Site.prototype.viewResetPassword = function() {

  /**
   * @type {app.user.view.Login}
   */
  var view = new app.user.view.Login();
  view.setResetPassword(true);
  this.switchView(view);
};

app.Site.prototype.viewHome = function() {
//  this.swapTheme('theme');
  /**
   * @type {app.base.view.Home}
   */
  var view = new app.base.view.Home(this.mqtt);
  this.switchView(view);
};

app.Site.prototype.viewEditUser = function(opt_landing) {
//  this.swapTheme('theme');

  /**
   * @type {app.user.view.Account}
   */
  var view = new app.user.view.Account(opt_landing);
  this.switchView(view);
};

app.Site.prototype.viewOrgCreate = function() {
  var view = new app.org.view.Org();
  this.switchView(view);
};

app.Site.prototype.viewOrg = function(orgId) {
  var view = new app.org.view.Org(orgId);
  this.switchView(view);
};

//-----------------------------------------------------[ Utility Stuff Below ]--

/**
 * An iterator over the layout nests. Called with two optional arguments.
 * @param {Function=} opt_lastly A function to call once the iterator has
 *    passed all the nests.
 * @param {Function=} opt_every A function to call for every nest. This function
 *    takes receives the nest as its first argument.
 * @return {!Function}
 * @private
 */
app.Site.prototype.getNestIter_ = function(opt_lastly, opt_every) {
  var counter = bad.utils.privateCounter();
  var tester = goog.bind(function(nest, i, arr) {
    opt_every ? opt_every(nest) : goog.nullFunction();
    if (counter() === arr.length) {
      counter = null;
      opt_lastly ? opt_lastly() : goog.nullFunction();
    }
  }, this);
  return tester;
};

/**
 * Hides all the nests in the layout, calling the optional passed in function
 * once all nests are hidden.
 * @param {Function=} opt_fn A function that is called once all the nests are
 *    hidden.
 */
app.Site.prototype.hideAllNests = function(opt_fn) {
  var lastly = this.getNestIter_(opt_fn);
  goog.array.forEach(this.nests, function(nest, i, arr) {

    nest.hide(goog.partial(lastly, nest, i, arr));
  }, this);
};

/**
 * Slides all nests closed. Calls @code{nest.hide()} on each nest after it has
 *   slided closed. Takes an optional function to call after all nests have
 *   closed.
 * @param {Function=} opt_fn An optionla function to call after all nests have
 *    closed.
 */
app.Site.prototype.slideAllNestsClosed = function(opt_fn) {
  var every = function(nest) { nest.hide(); };
  var lastly = this.getNestIter_(opt_fn, every);
  goog.array.forEach(this.nests, function(nest, i, arr) {
    nest.slideClosed(goog.partial(lastly, nest, i, arr));
  }, this);
};


/**
 * Changes the css styling of the whole site.
 * @param {string!} name The file name of the css file to apply to the site.
 *    This file should be located at @code{'css/themes/...'}
 */
app.Site.prototype.swapTheme = function(name) {
  var theme = name || 'default';
  this.user_.setTheme(theme);

  document.getElementById('pagestyle').setAttribute('href',
    'css/themes/' + theme + '.css');

//  this.setTileLayer();
};

///**
// * Once google maps is available this is the callback to execute.
// * @param {string=} opt_randName
// */
//app.Site.prototype.renderMapBox = function() {
//
//  var tileUrl = this.user_.getTheme();
//  console.debug('We came here...', tileUrl);
//
//  // create a map in the "map" div, set the view to a given place and zoom
//  this.map = L.mapbox.map('map').setView([51.505, -0.09], 13);
//
//  this.setTileLayer();
//
////  // add an OpenStreetMap tile layer
////  L.mapbox.tileLayer(tileUrl, {
////      attribution: ''
////  }).addTo(map);
//
//  // add a marker in the given location, attach some popup content to it and open the popup
//  L.marker([51.5, -0.09]).addTo(this.map)
//      .bindPopup('A pretty CSS3 popup. <br> Easily customizable.')
//      .openPopup();
//
//
//
//
//
////
////  console.debug('HERE IS THE USER THEME:', tileUrl)
////
////  var map = L.mapbox.map('mapCanvas', tileUrl).setZoom(2);
////  var marker = L.marker([0, 0]).addTo(map);
////
////  var setPosition = function(payload) {
////    var latLng = L.latLng(payload['lat'], payload['lon']);
////    console.debug('Setting position:', latLng);
////    marker.setLatLng(latLng);
////    map.panTo(latLng);
////  };
////
////  this.getHandler().listen(
////    this.mqtt,
////    'owntracks/jan/phone',
////    function(e) {
////      setPosition(goog.json.parse(e.payload));
////    }
////  );
//};

//app.Site.prototype.setTileLayer = function() {
//
//  // add an OpenStreetMap tile layer
//  L.mapbox.tileLayer(this.user_.getTheme(), {
//      attribution: ''
//  }).addTo(this.map);
//
//};
