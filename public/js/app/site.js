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
    this.layout_.setInitialSize(mainCells[0], 41);
    this.layout_.setInitialSize(mainCells[2], 23);
    this.layout_.setDraggerThickness(0);
    this.layout_.setWidthToViewport(true);
    this.layout_.setHeightToViewport(true);
    this.layout_.setMargin(topMargin, rightMargin, bottomMargin, leftMargin);

    // Create main horizontal layout.
    var mainHorizontalLayout = this.layout_.setInnerLayout(
        innerCellsHorizontal,
        mainCells[1],
        bad.ui.Layout.Orientation.HORIZONTAL
    );
    mainHorizontalLayout.setDraggerThickness(5);
    mainHorizontalLayout.setInitialSize(innerCellsHorizontal[0], 0 - 5);
    mainHorizontalLayout.setInitialSize(innerCellsHorizontal[2], 0 - 5);

    // Up-Down Layout in the left.
    var leftVerticalLayout = mainHorizontalLayout.setInnerLayout(innerCellsVertical,
        innerCellsHorizontal[0],
        bad.ui.Layout.Orientation.VERTICAL
    );
    leftVerticalLayout.setInitialSize(innerCellsVertical[0], 0 - 5);
    leftVerticalLayout.setInitialSize(innerCellsVertical[2], 0 - 5);

    // Up-Down Layout in the right.
    var rightVerticalLayout = mainHorizontalLayout.setInnerLayout(innerCellsVertical,
        innerCellsHorizontal[2],
        bad.ui.Layout.Orientation.VERTICAL
    );
    rightVerticalLayout.setInitialSize(innerCellsVertical[0], 0 - 5);
    rightVerticalLayout.setInitialSize(innerCellsVertical[2], 0 - 5);

    this.listen(
        this.layout_,
        bad.ui.Layout.EventType.LAYOUT_READY,
        function(e) {
            if (e.target.getId() === id) {
                this.initNavigation();
            }
        }
    );

    // Create the layout in the DOM
    this.layout_.render();
};

app.Site.prototype.getLayout = function() {
    return this.layout_;
};

app.Site.prototype.initNavigation = function() {
    this.hideAllNests();
    this.slideOpenAllNests();
};

app.Site.prototype.hideAllNests = function() {
    goog.object.forEach(this.getLayout().getNests(), function(nest) {
        this.hideNest(nest);
    }, this);
};

app.Site.prototype.slideHideAllNests = function() {
    goog.object.forEach(this.getLayout().getNests(), function(nest) {
        this.slideHideNest(nest);
    }, this);
};

app.Site.prototype.slideOpenAllNests = function() {
    goog.object.forEach(this.getLayout().getNests(), function(nest) {
        this.slideOpenNest(nest);
    }, this);
};

app.Site.prototype.slideOpenNest = function(nest) {
    if (nest.slideOpen) {
        nest.slideOpen();
    }
};

app.Site.prototype.slideHideNest = function(nest) {
    if (nest.slideClosed) {
        nest.slideClosed(function() {
            nest.hide();
        });
    }
};

app.Site.prototype.hideNest = function(nest) {
    if (nest.hide) {
        nest.hide();
    }
};

app.Site.prototype.openLeft = function(op_perCent, opt_pixels, opt_callback) {
    this.getLayout().getNest('main', 'left').slideOpen(
        op_perCent, opt_pixels, opt_callback);
};

app.Site.prototype.openRight = function(op_perCent, opt_pixels, opt_callback) {
    this.getLayout().getNest('main', 'right').slideOpen(
        op_perCent, opt_pixels, opt_callback);
};

app.Site.prototype.closeLeft = function() {
    this.slideHideNest(this.getLayout().getNest('main', 'left'));
};

app.Site.prototype.closeRight = function() {
    this.slideHideNest(this.getLayout().getNest('main', 'right'));
};

app.Site.prototype.openLeftToRight = function() {
    this.openLeft();
    this.closeRight();
};

app.Site.prototype.openRightToLeft = function() {
    this.openRight();
    this.closeLeft();
};
