goog.provide('app.org.view.Org');

goog.require('app.org.panel.NavPanel');
goog.require('app.org.EventType');
goog.require('app.org.panel.SignUp');
goog.require('bad.ui.View');

/**
 * @extends {bad.ui.View}
 * @param {string=} opt_orgId Active organisation's ID.
 * @constructor
 */
app.org.view.Org = function(opt_orgId) {
    bad.ui.View.call(this);

    console.debug('New view created...');

    /**
     * If an id is passed in we can view its detail, otherwise this is a
     * org create call.
     * @type {string=|null}
     * @private
     */
    this.activeOrgId_ = opt_orgId || null;
};
goog.inherits(app.org.view.Org, bad.ui.View);

app.org.view.Org.prototype.configurePanels = function() {
    var layout = this.getLayout();
    var user = this.getUser();


};

app.org.view.Org.prototype.displayPanels = function() {
    if (this.activeOrgId_) {
        this.createNavPanel();
        this.createOrgViewPanel();
    } else {
        this.createOrgEditPanel();
    }
};

app.org.view.Org.prototype.createOrgViewPanel = function(opt_uri) {
    var uriString = opt_uri || exp.urlMap.ORGS.READ + '/' + this.activeOrgId_;
    var layout = this.getLayout();
    var user = this.getUser();

    var panel = new bad.ui.Panel();
    panel.setUri(new goog.Uri(uriString));
    panel.setUser(user);
    panel.setNestAsTarget(layout.getNest('main', 'center'));
    this.addPanelToView('replace', panel);
    panel.renderWithTemplate();
};

app.org.view.Org.prototype.createOrgEditPanel = function(opt_url) {
    var uriString = opt_url || exp.urlMap.ORGS.CREATE;
    var layout = this.getLayout();
    var user = this.getUser();

    var panel = new app.org.panel.SignUp('orgForm');
    panel.setUri(new goog.Uri(uriString));
    panel.setUser(user);
    panel.setNestAsTarget(layout.getNest('main', 'center'));
    this.addPanelToView('replace', panel);
    panel.renderWithTemplate();
};

app.org.view.Org.prototype.createNavPanel = function() {
    var layout = this.getLayout();
    var user = this.getUser();

    /**
     * @type {app.org.panel.NavPanel}
     */
    var panel = new app.org.panel.NavPanel(this.activeOrgId_);
    panel.setUser(user);
    panel.setNestAsTarget(layout.getNest('main', 'left', 'mid'));
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

    console.debug('View gets event:', value, data);

    /*
     * Nav panel dispatches:
     * app.org.EventType.UPDATE_PROFILE
     * app.org.EventType.UPDATE_SECURITY
     * app.org.EventType.UPDATE_EMAILS
     * app.org.EventType.UPDATE_BILLING
     * app.org.EventType.UPDATE_SUCCESS
     */
    var urlString = '';
    switch (value) {
        case app.org.EventType.CANCEL:
            console.debug('Event: app.org.EventType.CANCEL');
            this.displayPanels();
            break;
        case app.org.EventType.UPDATE_PROFILE:
            console.debug('Event: app.org.EventType.UPDATE_PROFILE');
            urlString = exp.urlMap.ORGS.UPDATE + '/' + this.activeOrgId_ +
                '/profile';
            this.enterEditForm(urlString);
            break;
        case app.org.EventType.UPDATE_BILLING:
            console.debug('Event: app.org.EventType.UPDATE_BILLING');
            urlString = exp.urlMap.ORGS.UPDATE + '/' + this.activeOrgId_ +
                '/billing';
            this.enterEditForm(urlString);
            break;
        case app.org.EventType.UPDATE_SUCCESS:
            console.debug('Event: app.org.EventType.UPDATE_SUCCESS', data);
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

/**
 * TODO: Generalise this higher up. More than ust this view uses something
 * like this.
 * @param view
 */
app.org.view.Org.prototype.switchView = function(view) {
    var nest = this.getLayout().getNest('main', 'left');
    var callback = goog.bind(function(){
        nest.hide();
        this.appDo(view);
    }, this);
    nest.slideClosed(callback);
};