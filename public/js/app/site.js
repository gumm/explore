/**
 * @fileoverview Base scripts for initialising the app site.
 */
goog.provide('app.Site');

goog.require('bad.ui.Component');
goog.require('bad.ui.Layout');
goog.require('goog.events.EventHandler');


/**
 * Constructor of the main site object.
 * @extends {goog.events.EventHandler}
 * @constructor
 */
app.Site = function(wsServer, wsPort) {
    goog.events.EventHandler.call(this, this);

    this.wsServer = wsServer;
    this.wsPort = wsPort;
};
goog.inherits(app.Site, goog.events.EventHandler);




/**
 * Home page and landing page after login.
 */
app.Site.prototype.initSite = function() {
    console.debug('This is where we land');
    this.initLayout_();
};

/**
 * Create the layout component.
 * @private
 */
app.Site.prototype.initLayout_ = function() {

    this.layout_ = new bad.ui.Layout('root', ['A', 'B', 'C'], 'horizontal');

    var topMargin = 90;
    var bottomMargin = 20;

    // Set the defaults for the site.
    this.layout_.setTarget(document.body);

    console.debug('------------>', this.layout_.getTarget());


    this.layout_.setInitialSize('A', 259);
    this.layout_.setInitialSize('C', 200);
    this.layout_.setDraggerThickness(6);
    this.layout_.setWidthToViewport(true);
    this.layout_.setHeightToViewport(true);
    this.layout_.setMargin(topMargin, 0, bottomMargin, 0);
    this.layout_.setMinimumSize('A', 200);
    this.layout_.setMinimumSize('C', 170);

    // Create a west layout.
    this.layout_.setInnerLayout('west', ['1', '2', '3'], 'A',
        bad.ui.Layout.Orientation.VERTICAL);

    // Create an middle layout
    this.layout_.setInnerLayout('middle', ['1', '2', '3'], 'B',
        bad.ui.Layout.Orientation.VERTICAL);

    // Create an east layout
    this.layout_.setInnerLayout('east', ['1', '2', '3'], 'C',
        bad.ui.Layout.Orientation.VERTICAL);

    // Create the layout in the DOM
    this.layout_.render();
};