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

    this.create = new app.org.panel.SignUp('org-form');
    this.create.setUri(new goog.Uri(exp.urlMap.ORGS.CREATE));
    this.create.setUser(user);
    this.create.setNestAsTarget(layout.getNest('main', 'center'));
    this.addPanelToView(bad.utils.makeId(), this.create);

    this.read = new bad.ui.Panel();
    this.read.setUser(user);
    this.read.setNestAsTarget(layout.getNest('main', 'center'));
    this.addPanelToView('replace', this.read);
};

app.org.view.Org.prototype.displayPanels = function() {
    if (this.activeOrgId_) {
        this.createNavPanel();
        this.read.setUri(new goog.Uri(exp.urlMap.ORGS.READ + '/' +
            this.activeOrgId_));
        this.read.renderWithTemplate();
    } else {
        this.create.renderWithTemplate();
    }
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

    /*
     * Nav panel dispatches:
     * app.org.EventType.UPDATE_PROFILE
     * app.org.EventType.UPDATE_SECURITY
     * app.org.EventType.UPDATE_EMAILS
     * app.org.EventType.UPDATE_BILLING
     */

    switch (value) {
        case app.org.EventType.UPDATE_PROFILE:
            var urlString = exp.urlMap.ORGS.UPDATE + '/' + this.activeOrgId_;
            this.enterEditForm(urlString);
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

    var layout = this.getLayout();
    var user = this.getUser();

    var form = new app.org.panel.SignUp('org-form');
    form.setUri(new goog.Uri(urlString));
    form.setUser(user);
    form.setNestAsTarget(layout.getNest('main', 'center'));
    this.addPanelToView('replace', form);
    form.renderWithTemplate();
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