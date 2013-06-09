/**
 * @fileoverview The top level app. From here the views are controlled.
 */
goog.provide('app.Site');

goog.require('bad.ui.Component');
goog.require('bad.ui.Layout');
goog.require('goog.events.EventHandler');
goog.require('goog.net.XhrIo');


/**
 * Constructor of the main site object. Inherits from EventHandler, so it
 * can simply subscribe to events on its children.
 * @param {goog.net.XhrManager} xMan This site's XhrManager.
 *
 * @constructor
 * @extends {goog.events.EventHandler}
 */
app.Site = function(xMan) {
    goog.events.EventHandler.call(this, this);

    this.xMan = xMan;

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
    mainHorizontalLayout.setInitialSize(innerCellsHorizontal[0], 220);
    mainHorizontalLayout.setInitialSize(innerCellsHorizontal[2], 220);

    // Up-Down Layout in the left.
    var leftVerticalLayout = mainHorizontalLayout.setInnerLayout(
        innerCellsVertical,
        innerCellsHorizontal[0],
        bad.ui.Layout.Orientation.VERTICAL
    );
    leftVerticalLayout.setInitialSize(innerCellsVertical[0], 50);
    leftVerticalLayout.setInitialSize(innerCellsVertical[2], 50);

    // Up-Down Layout in the right.
    var rightVerticalLayout = mainHorizontalLayout.setInnerLayout(
        innerCellsVertical,
        innerCellsHorizontal[2],
        bad.ui.Layout.Orientation.VERTICAL
    );
    rightVerticalLayout.setInitialSize(innerCellsVertical[0], 50);
    rightVerticalLayout.setInitialSize(innerCellsVertical[2], 50);

    this.listen(
        this.layout_,
        bad.ui.Layout.EventType.LAYOUT_READY,
        function(e) {
            if (e.target.getId() === id) {
                this.hideAllNests();
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

    var callback = goog.bind(function(e) {
        var xhr = e.target;
        var html = goog.dom.htmlToDocumentFragment(xhr.getResponseText());
        var element = this.layout_.getNestElement('main', 'center');
        goog.dom.append(/** @type {!Node} */ (element), html);
    }, this);
    this.xMan.send(
        '/login', // id
        '/login', // url
        'GET',      // opt_method
        null,       // opt_content
        null,       // opt_headers
        10,         // opt_priority
        callback,   // opt_callback
        2,          // opt_maxRetries
        goog.net.XhrIo.ResponseType.TEXT // opt_responseType
    );
};

app.Site.prototype.hideAllNests = function() {
    var nests = [
        this.layout_.getNest('main', 'left'),
        this.layout_.getNest('main', 'left', 'top'),
        this.layout_.getNest('main', 'left', 'bottom'),
        this.layout_.getNest('main', 'right'),
        this.layout_.getNest('main', 'right', 'top'),
        this.layout_.getNest('main', 'right', 'bottom')
    ];
    goog.array.forEach(nests, function(nest) {
        nest.hide();
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

/**
* @param {Object} nest
*/
app.Site.prototype.slideOpenNest = function(nest) {
    if (nest.slideOpen) {
        nest.slideOpen();
    }
};

/**
* @param {Object} nest
*/
app.Site.prototype.slideHideNest = function(nest) {
    if (nest.slideClosed) {
        nest.slideClosed(function() {
            nest.hide();
        });
    }
};

/**
* @param {Object} nest
*/
app.Site.prototype.hideNest = function(nest) {
    if (nest.hide) {
        nest.hide();
    }
};

/**
* @param {number=} op_perCent
* @param {number=} opt_pixels
* @param {Function=} opt_callback
*/
app.Site.prototype.openLeft = function(op_perCent, opt_pixels, opt_callback) {
    this.getLayout().getNest('main', 'left').slideOpen(
        op_perCent, opt_pixels, opt_callback);
};

/**
* @param {number=} op_perCent
* @param {number=} opt_pixels
* @param {Function=} opt_callback
*/
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