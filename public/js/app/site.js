/**
 * @fileoverview The top level app. From here the views are controlled.
 */
goog.provide('app.Site');

goog.require('bad.ui.Component');
goog.require('bad.ui.Layout');
goog.require('goog.events.EventHandler');


/**
 * Constructor of the main site object. Inherits from EventHandler, so it
 * can simply subscribe to events on its children.
 *
 * @constructor
 * @extends {goog.events.EventHandler}
 */
app.Site = function() {
    goog.events.EventHandler.call(this, this);

    /**
     * @type {?bad.ui.Layout}
     * @private
     */
    this.layout_ = null;
};
goog.inherits(app.Site, goog.events.EventHandler);


/**
 * Home page and landing page after login.
 */
app.Site.prototype.initSite = function() {
    this.initLayout_();
};

/**
 * Create the layout component.
 * @private
 */
app.Site.prototype.initLayout_ = function() {

    var id = Math.floor(Math.random() * 2147483648).toString(36);
    var mainCells = ['left', 'center', 'right'];
    var innerCells = ['top', 'mid', 'bot'];
    var innerInnerCells = ['x', 'y', 'z'];
    var topMargin = 90;
    var bottomMargin = 20;

    /**
     * Create a new layout
     * @type {bad.ui.Layout}
     * @private
     */
    this.layout_ = new bad.ui.Layout(id, mainCells,
        bad.ui.Layout.Orientation.HORIZONTAL
    );

    // Set the defaults for the site.
    this.layout_.setTarget(goog.dom.getDocument().body);
    this.layout_.setInitialSize(mainCells[0], 260);
    this.layout_.setInitialSize(mainCells[2], 200);
    this.layout_.setDraggerThickness(5);
    this.layout_.setGrabberClass('icon-resize-vertical icon-white');
    this.layout_.setWidthToViewport(true);
    this.layout_.setHeightToViewport(true);
    this.layout_.setMargin(topMargin, 0, bottomMargin, 0);
    this.layout_.setMinimumSize(mainCells[0], 0);
    this.layout_.setMinimumSize(mainCells[2], 0);

    // Create a west layout.
    var leftInnerLayout = this.layout_.setInnerLayout(innerCells, mainCells[0],
        bad.ui.Layout.Orientation.VERTICAL);

    // Create an middle layout
    this.layout_.setInnerLayout(innerCells, mainCells[1],
        bad.ui.Layout.Orientation.VERTICAL);

    // Create an east layout
    this.layout_.setInnerLayout(innerCells, mainCells[2],
        bad.ui.Layout.Orientation.VERTICAL);

    // Create an inner inner layout.
    var leftInnerMidLayout = leftInnerLayout.setInnerLayout(innerInnerCells, innerCells[1],
        bad.ui.Layout.Orientation.HORIZONTAL
    );

    // And an inner inner inner layout.
    leftInnerMidLayout.setInnerLayout(['a','b','c'], innerInnerCells[2],
        bad.ui.Layout.Orientation.VERTICAL
    );

    this.listen(
        this.layout_,
        bad.ui.Layout.EventType.LAYOUT_READY,
        function(e) {
            if (e.target.getId() === id) {
                console.debug('ALL LAYOUTS ARE READY AND IN THE DOM!');
                nest = this.layout_.getNest('left', 'mid', 'z', 'a')
            }
        }
    );

    // Create the layout in the DOM
    this.layout_.render();
};

app.Site.prototype.getLayout = function() {
    return this.layout_;
};
