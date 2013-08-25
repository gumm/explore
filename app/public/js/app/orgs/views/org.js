goog.provide('app.org.view.Org');

goog.require('app.org.EventType');
goog.require('app.org.panel.NavPanel');
goog.require('app.org.panel.SignUp');
goog.require('bad.ui.View');
goog.require('goog.dom.dataset');

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
        if (this.navPanel_) {
            this.navPanel_.resetMenu();
        } else {
            this.createNavPanel(this.activeOrgId_);
        }
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
    var beforeReadyCallback = goog.bind(function() {
        var ownerLink = goog.dom.getElement('ownerLink');
        var ownerId = goog.dom.dataset.get(ownerLink, 'id');
        var editProfile = goog.dom.getElement('editContacts');
        var editPhysical = goog.dom.getElement('editPhysAddress');
        var editPostal = goog.dom.getElement('editPostalAddress');

        this.getHandler().listen(
            ownerLink,
            goog.events.EventType.CLICK,
            function() {
                this.dispatchActionEvent(app.org.EventType.VIEW_OWNER, ownerId);
            }, undefined, this
        ).listen(
            editPhysical,
            goog.events.EventType.CLICK,
            function() {
                this.dispatchActionEvent(app.org.EventType.UPDATE_PHYSICAL);
            }, undefined, this
        ).listen(
            editPostal,
            goog.events.EventType.CLICK,
            function() {
                this.dispatchActionEvent(app.org.EventType.UPDATE_POSTAL);
            }, undefined, this
        ).listen(
            editProfile,
            goog.events.EventType.CLICK,
            function() {
                this.dispatchActionEvent(app.org.EventType.UPDATE_PROFILE);
            }, undefined, this);
    }, panel);

    panel.setBeforeReadyCallback(beforeReadyCallback);
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

app.org.view.Org.prototype.createNavPanel = function(orgId) {

    var uriString = exp.urlMap.ORGS.READ + '/' + orgId + '/all';

    /**
     * @type {app.org.panel.NavPanel}
     */
    this.navPanel_ = new app.org.panel.NavPanel();
    this.navPanel_.setUri(new goog.Uri(uriString));
    this.navPanel_.setUser(this.getUser());
    this.navPanel_.setNestAsTarget(
        this.getLayout().getNest('main', 'left', 'mid'));
    this.navPanel_.setBeforeReadyCallback(goog.bind(this.slideNavIn, this));
    this.addPanelToView(bad.utils.makeId(), this.navPanel_);
    this.navPanel_.renderWithJSON(
        goog.bind(this.navPanel_.onOrgInfo, this.navPanel_));
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
            if (this.activeOrgId_) {
                this.displayPanels();
            } else {
                this.appDo(app.doMap.VIEW_EDIT_USER, 'orgList');
            }
            break;
        case app.org.EventType.UPDATE_PROFILE:
            this.enterEditForm(exp.urlMap.ORGS.UPDATE + '/' +
                this.activeOrgId_ + '/profile');
            break;
        case app.org.EventType.UPDATE_PHYSICAL:
            this.enterEditForm(exp.urlMap.ORGS.UPDATE + '/' +
                this.activeOrgId_ + '/loc');
            break;
        case app.org.EventType.UPDATE_POSTAL:
            this.enterEditForm(exp.urlMap.ORGS.UPDATE + '/' +
                this.activeOrgId_ + '/box');
            break;
        case app.org.EventType.UPDATE_BILLING:
            this.enterEditForm(exp.urlMap.ORGS.UPDATE + '/' +
                this.activeOrgId_ + '/billing');
            break;
        case app.org.EventType.UPDATE_SUCCESS:
            this.activeOrgId_ = data.org['_id'];
//            this.swapCss(data.org['media']);
            this.appDo(app.doMap.SWAP_THEME, data.org['media']['css']);
            this.displayPanels();
            break;
        case app.org.EventType.CHANGE_SCOPE:
//            this.swapCss(data['media']);

            this.appDo(app.doMap.SWAP_THEME, data['media']['css']);
            break;
        case app.org.EventType.VIEW_OWNER:
            this.switchView(goog.bind(
                this.appDo, this, app.doMap.VIEW_EDIT_USER, data));
            break;
        default:
            console.log('app.org.view.Org No action for: ', value, data);
    }
};

app.org.view.Org.prototype.swapCss = function(media) {
    document.getElementById('pagestyle').setAttribute('href', 'css/themes/'+ media['css'] +'.css');
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
    slider.slideOpen(null, size, goog.nullFunction);
};

app.org.view.Org.prototype.switchView = function(fn) {
    var nest = this.getLayout().getNest('main', 'left');
    var callback = goog.bind(function() {
        nest.hide();
        fn();
    }, this);
    nest.slideClosed(callback);
};
