// Copyright 2011 Trinity Telecomms (Pty) Ltd. All Rights Reserved.

/**
 * @fileoverview  A panel manager class
 */

goog.provide('bad.ui.View');

goog.require('goog.events.EventHandler');
goog.require('goog.events.EventType');
goog.require('goog.object');

/**
 * Create a view, representing a number of panel objects in specific positions
 * in a site layout.
 * @param {Object} site The site object to which this view belongs.
 * @param {(string|number)=} opt_Id An optional name for this view.
 * @constructor
 * @extends {goog.events.EventHandler}
 */
bad.ui.View = function(site, opt_Id) {
    goog.events.EventHandler.call(this, this);

    /**
     * A reference to the site and layout to which this view belongs
     * @type {Object}
     * @protected
     */
    this.site = site;

    /**
     * A map of all the panels that are configured for this view.
     * @type {Object.<string, bad.ui.Panel>}
     */
    this.panelMap_ = {};

    /**
     * @type {?(string|number)}
     * @private
     */
    this.viewId_ = opt_Id || null;
};
goog.inherits(bad.ui.View, goog.events.EventHandler);

/**
 * Render each of the panels in this view.
 */
bad.ui.View.prototype.render = function() {
    this.preRender();
};

bad.ui.View.prototype.preRender = function() {
    this.renderInternal();
};

bad.ui.View.prototype.renderInternal = function() {
    this.configurePanels();
    this.displayPanels();
    this.postRender();
};

bad.ui.View.prototype.configurePanels = goog.nullFunction;

bad.ui.View.prototype.displayPanels = goog.nullFunction;

bad.ui.View.prototype.postRender = goog.nullFunction;

bad.ui.View.prototype.onPanelAction = goog.nullFunction;

/**
 * Dispose of each of the panels in this view.
 */
bad.ui.View.prototype.disposeInternal = function() {
    bad.ui.View.superClass_.disposeInternal.call(this);

    this.disposePanels_();
};

//------------------------------------------------------[ Panel Manipulation ]--

/**
 * Dispose each of the panels in turn.
 */
bad.ui.View.prototype.disposePanels_ = function() {
    goog.object.forEach(this.panelMap_, function(panel) {
        this.disposePanel(panel);
    }, this);
};

/**
 * Dispose of the panel with the given id.
 * Disposing of a panel means removal of the panel from the layout, and
 * disposing of it in itself.
 * @param {string|bad.ui.Panel} id The id of nest in which the panel
 *      is that needs to be disposed, or the entire panel object itself.
 */
bad.ui.View.prototype.disposePanel = function(id) {
    var panel = null;
    var panelId = null;
    var nestId = null;

    switch (typeof id) {
        case 'string':
            if (this.panelMap_[id]) {
                panel = this.panelMap_[id];
                panelId = panel.getId();
                nestId = id;
            }
            break;
        case 'object':
            panel = id;
            panelId = panel.getId();
            nestId = goog.object.findKey(this.panelMap_, function(innerPanel) {
                return innerPanel.getId() === panelId;
            });
            break;
        default:
            console.debug('Can not resolve panel id:' + id);
    }

    if (panel && panelId && nestId) {
        this.getLayout().removeChild(
            /** @type {goog.ui.Component} */ (panel),
            true
        );
        panel.dispose();
        panel = null;
        goog.object.remove(this.panelMap_, nestId);
    }
};

//------------------------------------------------------[ Setters and Getters]--

/**
 * @param {?(string|number)} id
 */
bad.ui.View.prototype.setViewId = function(id) {
    this.viewId_ = id;
};

/**
 * @return {?(string|number)}
 */
bad.ui.View.prototype.getViewId = function() {
    return this.viewId_;
};

/**
 * @return {bad.UserManager}
 */
bad.ui.View.prototype.getUser = function() {
    return this.getSite().getUser();
};

/**
 * @return {bad.ui.Layout}
 */
bad.ui.View.prototype.getLayout = function() {
    return this.getSite().getLayout();
};

/**
 * @return {Object}
 */
bad.ui.View.prototype.getSite = function() {
    return this.site;
};

/**
 * @param {!string} nestId
 * @param {!bad.ui.Panel} panel
 */
bad.ui.View.prototype.setPanel = function(nestId, panel) {
    var target = this.getLayout().getNests()[nestId].element;
    this.attachPanelInternal_(panel, target, nestId);
};

bad.ui.View.prototype.initPanelLikeModal = function(panel) {
    var target = goog.dom.getDocument().body;
    var nestId = Math.floor(Math.random() * 2147483648).toString(36);
    panel.setInitLikeModal(true);
    this.attachPanelInternal_(panel, target, nestId);
};

bad.ui.View.prototype.attachPanelInternal_ = function(panel, target, nestId) {
    var layout = this.getLayout();
    panel.setTarget(target);
    panel.setNestId(nestId);

    // This panel already exists in the views panel map. Destroy it.
    if (this.panelMap_[nestId]) {
        this.disposePanel(nestId);
    }

    // This panel already exists in layout as a child. Remove it.
    if (layout.getChild(panel.getId())) {
        layout.removeChild(layout.getChild(panel.getId()));
    }

    this.panelMap_[nestId] = panel;
    layout.addLayoutChild(panel);
    this.initListenersForPanel_(panel);
};

bad.ui.View.prototype.initListenersForPanel_ = function(panel) {
    this.listen(
        panel,
        bad.ui.EventType.PANEL_DISPOSE,
        goog.bind(this.disposePanel, this, panel)
    ).listen(
        panel,
        bad.ui.EventType.PANEL_ACTION,
        goog.bind(this.onPanelAction, this)
    );
};

/**
 * @param {string} nestId
 * @return {bad.ui.Panel}
 */
bad.ui.View.prototype.getPanel = function(nestId) {
    return this.panelMap_[nestId];
};

//------------------------------------------------------[ Panel Manipulation ]--

bad.ui.View.prototype.hidePanel = function(nestId) {
    var nests = this.getLayout().getNests();
    if (nests[nestId]) {
        nests[nestId].hide();
    }
};

/**
 * @param {string} nestId
 * @param {number=} opt_percentage Open to a fraction of the available space.
 * @param {number=} opt_pixels Open a set number of pixels.
 */
bad.ui.View.prototype.showPanel =
    function(nestId, opt_percentage, opt_pixels) {
        this.getLayout().getNests()[nestId].show(opt_percentage, opt_pixels);
    };

/**
 * Slide a panel open.
 * @param {string} nestId The nest id to slide open.
 * @param {number=} opt_percentage
 * @param {number=} opt_pixels
 * @param {function(*)=} opt_callback
 */
bad.ui.View.prototype.slidePanelOpen =
    function(nestId, opt_percentage, opt_pixels, opt_callback) {
        this.getLayout().getNests()[nestId].
            slideOpen(opt_percentage, opt_pixels, opt_callback);
    };

/**
 * Slide a panel closed.
 * @param {string} nestId The nest id to slide open.
 * @param {function(*)=} opt_callback
 */
bad.ui.View.prototype.slidePanelClosed = function(nestId, opt_callback) {
    this.getLayout().getNests()[nestId].slideClosed(opt_callback);
};

bad.ui.View.prototype.lockPanel = function(nestId) {
    this.getLayout().getNests()[nestId].lock();
};

bad.ui.View.prototype.hideAllPanels = function() {
    goog.object.forEach(this.getLayout().getNests(), function(nest) {
        if (nest.hide) {
            nest.hide();
        }
    }, this);
};

bad.ui.View.prototype.disposeCPanel = function() {
    this.disposePanel('$C$1');
    this.disposePanel('$C$2');
    this.disposePanel('$C$3');
    this.disposePanel('$C');
    this.hidePanel('$C');
};
