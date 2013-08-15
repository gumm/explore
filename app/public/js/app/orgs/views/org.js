goog.provide('app.org.view.Org');

goog.require('app.org.EventType');
goog.require('app.org.panel.NavPanel');
goog.require('app.org.panel.SignUp');
goog.require('bad.ui.View');

/**
 * @extends {bad.ui.View}
 * @param {string=} opt_orgId Active organisation's ID.
 * @constructor
 */
app.org.view.Org = function(opt_orgId) {
    bad.ui.View.call(this);

    /**
     * If an id is passed in we can view its detail, otherwise this is a
     * org create call.
     * @type {?string}
     * @private
     */
    this.activeOrgId_ = opt_orgId || null;
};
goog.inherits(app.org.view.Org, bad.ui.View);

app.org.view.Org.prototype.displayPanels = function() {
    if (this.activeOrgId_) {
        this.createNavPanel();
        this.createOrgViewPanel();
    } else {
        this.createOrgEditPanel();
    }
};

/**
 * @param {string=} opt_uri
 */
app.org.view.Org.prototype.createOrgViewPanel = function(opt_uri) {
    var uriString = opt_uri || exp.urlMap.ORGS.READ + '/' + this.activeOrgId_;

    /**
     * @type {bad.ui.Panel}
     */
    var panel = new bad.ui.Panel();
    panel.setUri(new goog.Uri(uriString));
    panel.setUser(this.getUser());
    panel.setNestAsTarget(this.getLayout().getNest('main', 'center'));
    this.addPanelToView('replace', panel);
    panel.renderWithTemplate();
};

/**
 * @param {string=} opt_uri
 */
app.org.view.Org.prototype.createOrgEditPanel = function(opt_uri) {
    var uriString = opt_uri || exp.urlMap.ORGS.CREATE;

    /**
     * @type {app.org.panel.SignUp}
     */
    var panel = new app.org.panel.SignUp('orgForm');
    panel.setUri(new goog.Uri(uriString));
    panel.setUser(this.getUser());
    panel.setNestAsTarget(this.getLayout().getNest('main', 'center'));
    this.addPanelToView('replace', panel);
    panel.renderWithTemplate();
};

app.org.view.Org.prototype.createNavPanel = function() {
    /**
     * @type {app.org.panel.NavPanel}
     */
    var panel = new app.org.panel.NavPanel();
    panel.setUser(this.getUser());
    panel.setNestAsTarget(this.getLayout().getNest('main', 'left', 'mid'));
    panel.setBeforeReadyCallback(goog.bind(this.slideNavIn, this));
    this.addPanelToView(bad.utils.makeId(), panel);
    panel.render();
};

/**
 * @param {bad.ActionEvent} e Event object.
 */
app.org.view.Org.prototype.onPanelAction = function(e) {
    var value = e.getValue();
    var data = e.getData();
    e.stopPropagation();

    /*
     * Nav panel dispatches:
     * app.org.EventType.CANCEL
     * app.org.EventType.UPDATE_PROFILE
     * app.org.EventType.UPDATE_BILLING
     * app.org.EventType.UPDATE_SUCCESS
     */
    switch (value) {
        case app.org.EventType.CANCEL:
            this.displayPanels();
            break;
        case app.org.EventType.UPDATE_PROFILE:
            this.enterEditForm(exp.urlMap.ORGS.UPDATE + '/' +
                this.activeOrgId_ + '/profile');
            break;
        case app.org.EventType.UPDATE_BILLING:
            this.enterEditForm(exp.urlMap.ORGS.UPDATE + '/' +
                this.activeOrgId_ + '/billing');
            break;
        case app.org.EventType.UPDATE_SUCCESS:
            this.activeOrgId_ = data.id;
            this.displayPanels();
            break;
        default:
            console.log('app.org.view.Org No action for: ', value, data);
    }
};

/**
* The sign-up form is used for sign-up, editing accounts, and passwords.
* It is destroyed on exit, and is thus recreated here each time it is called.
* @param {string} urlString The URL that will be called.
*/
app.org.view.Org.prototype.enterEditForm = function(urlString) {
    this.createOrgEditPanel(urlString);
};

/**
 * TODO: This also is used everywhere. Make it more general.
 */
app.org.view.Org.prototype.slideNavIn = function() {
    var size = 270;
    var slider = this.getLayout().getNest('main', 'left');
    slider.slideOpen(null, size,
        goog.bind(function() {
            console.debug('OK all done - panel in view now.');
        }, this)
    );
};
