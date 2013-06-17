goog.provide('app.user.HomePanel');

goog.require('bad.ui.Panel');

/**
 * The basic login form controller.
 * @param {!goog.Uri} uri
 * @param {Object} targetNest
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {bad.ui.Panel}
 * @constructor
 */
app.user.HomePanel = function(uri, targetNest, opt_domHelper) {
    bad.ui.Panel.call(this, uri, targetNest, opt_domHelper);

    /**
     * @type {Object}
     * @private
     */
    this.userData_ = {};
};
goog.inherits(app.user.HomePanel, bad.ui.Panel);

app.user.HomePanel.prototype.enterDocument = function() {

    this.getHandler().listen(
        goog.dom.getElement('user_list'),
        goog.events.EventType.CLICK,
        this.fetchUserList
    ).listen(
        goog.dom.getElement('btn-logout'),
        goog.events.EventType.CLICK,
        this.logOut
    );

    app.user.HomePanel.superClass_.enterDocument.call(this);
};

app.user.HomePanel.prototype.setUserData = function(data) {
    this.userData_ = data;
    console.debug('Home page received', this.userData_);
};

app.user.HomePanel.prototype.logOut = function() {
    var queryData = goog.uri.utils.buildQueryDataFromMap({'logout': true});
    this.xMan.post(this.uri_, queryData, goog.bind(this.onLogOut, this));
};

app.user.HomePanel.prototype.fetchUserList = function() {
    if (!this.userListContainer) {
        this.userListContainer = goog.dom.createDom(goog.dom.TagName.DIV, {});
        goog.dom.append(
            /** @type {!Node} */ (this.getElement()),
            this.userListContainer
        );
    }
    var uri = new goog.Uri('/accounts');
    this.xMan.get(uri, goog.bind(this.onUserListReceived, this));
};

app.user.HomePanel.prototype.onUserListReceived = function(e) {
    var xhr = e.target;
    var table = /** @type {Element} */ (goog.dom.htmlToDocumentFragment(
        xhr.getResponseText())
    );
    var replace = goog.dom.createDom(goog.dom.TagName.DIV, 'card', table);
    goog.dom.replaceNode(replace, this.userListContainer);
    this.userListContainer = replace;

};

app.user.HomePanel.prototype.onLogOut = function(e) {
    var xhr = e.target;
    if (xhr.isSuccess()) {
        window.open('/', '_self');
    } else {
        console.debug('Log Out was not successful. Try again...', e, xhr);
    }
};
