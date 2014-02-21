goog.provide('app.org.view.Org');

goog.require('app.BasicView');
goog.require('app.org.EventType');
goog.require('app.org.panel.DeleteOrg');
goog.require('app.org.panel.DetailPanel');
goog.require('app.org.panel.NavPanel');
goog.require('app.org.panel.SignUp');
goog.require('bad.OrgManager');
goog.require('goog.dom.dataset');

/**
 * @extends {app.BasicView}
 * @param {string=} opt_orgId Active organisation's ID.
 * @constructor
 */
app.org.view.Org = function(opt_orgId) {
  app.BasicView.call(this);

  this.activeOrg_ = new bad.OrgManager();
  this.activeOrg_.setId(opt_orgId);
};
goog.inherits(app.org.view.Org, app.BasicView);

app.org.view.Org.prototype.displayPanels = function() {
  if (this.activeOrg_.getId()) {
    if (this.navPanel_) {
      this.navPanel_.setOrg(this.activeOrg_);
      this.navPanel_.resetMenu();
    } else {
      this.createNavPanel(this.activeOrg_.getId());
    }
    this.createOrgDetailPanel();
  } else {
    this.createOrgEditPanel();
  }
};

app.org.view.Org.prototype.createOrgDetailPanel = function() {
  var uriString = exp.urlMap.ORGS.READ + '/' + this.activeOrg_.getId();

  /**
   * @type {app.org.panel.DetailPanel}
   */
  var panel = new app.org.panel.DetailPanel();
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

  switch (value) {
    case app.org.EventType.CANCEL:
    case app.base.EventType.MENU_HEAD:
      if (this.activeOrg_.getId()) {
        this.displayPanels();
      } else {
        this.appDo(app.doMap.VIEW_EDIT_USER, 'orgList');
      }
      break;
    case app.org.EventType.UPDATE_PROFILE:
      this.enterEditForm(exp.urlMap.ORGS.UPDATE + '/' +
        this.activeOrg_.getId() + '/profile');
      break;
    case app.org.EventType.UPDATE_PHYSICAL:
      this.enterEditForm(exp.urlMap.ORGS.UPDATE + '/' +
        this.activeOrg_.getId() + '/loc');
      break;
    case app.org.EventType.UPDATE_POSTAL:
      this.enterEditForm(exp.urlMap.ORGS.UPDATE + '/' +
        this.activeOrg_.getId() + '/box');
      break;
    case app.org.EventType.UPDATE_BILLING:
      this.enterEditForm(exp.urlMap.ORGS.UPDATE + '/' +
        this.activeOrg_.getId() + '/billing');
      break;
    case app.org.EventType.UPDATE_SUCCESS:
      var orgData = /** @type {?Object} */(data);
      this.activeOrg_.updateData(orgData);
      this.appDo(app.doMap.SWAP_THEME, this.activeOrg_.getCss());
      this.displayPanels();
      break;
    case app.org.EventType.CHANGE_SCOPE:
      this.activeOrg_.updateData(data);
      this.appDo(app.doMap.SWAP_THEME, this.activeOrg_.getCss());
      break;
    case app.org.EventType.VIEW_OWNER:
      this.switchView(goog.bind(
        this.appDo, this, app.doMap.VIEW_EDIT_USER, data));
      break;
    case app.org.EventType.DELETE:
      this.confirmRemoveAccount();
      break;
    case app.org.EventType.ORG_DELETE_CANCELED:
      this.displayPanels();
      break;
    case app.org.EventType.ORG_DELETE_SUCCESS:
      this.switchView(goog.bind(
        this.appDo, this, app.doMap.VIEW_HOME));
      break;
    default:
      console.log('app.org.view.Org No action for: ', value, data);
  }
};

app.org.view.Org.prototype.confirmRemoveAccount = function() {

  var form = new app.org.panel.DeleteOrg('confaccdel-form');
  form.setUri(new goog.Uri(exp.urlMap.ORGS.DELETE + '/' +
    this.activeOrg_.getId()));
  form.setUser(this.getUser());
  form.setNestAsTarget(this.getLayout().getNest('main', 'center'));
  this.addPanelToView('replace', form);
  form.renderWithTemplate();
};

/**
 * The sign-up form is used for sign-up, editing accounts, and passwords.
 * It is destroyed on exit, and is thus recreated here each time it is called.
 * @param {string} urlString The URL that will be called.
 */
app.org.view.Org.prototype.enterEditForm = function(urlString) {
  this.createOrgEditPanel(urlString);
};
