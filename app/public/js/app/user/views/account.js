goog.provide('app.user.view.Account');

goog.require('app.BasicView');
goog.require('app.base.EventType');
goog.require('app.doMap');
goog.require('app.org.panel.List');
goog.require('app.user.EventType');
goog.require('app.user.panel.AvApi');
goog.require('app.user.panel.Delete');
goog.require('app.user.panel.Edit');
goog.require('app.user.panel.NavPanel');
goog.require('app.user.panel.PasswordEdit');
goog.require('bad.ui.Panel');
goog.require('bad.utils');
goog.require('goog.Uri');
goog.require('goog.dom');
goog.require('goog.events.EventType');

/**
 * @param {string=} opt_landing Optional panel to land on.
 * @extends {app.BasicView}
 * @constructor
 */
app.user.view.Account = function(opt_landing) {
  app.BasicView.call(this);
  this.landing_ = opt_landing || null;
};
goog.inherits(app.user.view.Account, app.BasicView);

app.user.view.Account.prototype.createNavPanel = function() {
  /**
   * @type {bad.ui.Panel}
   */
  this.nav = new app.user.panel.NavPanel();
  this.nav.setUser(this.getUser());
  this.nav.setNestAsTarget(this.getLayout().getNest('main', 'left', 'mid'));
  this.nav.setBeforeReadyCallback(goog.bind(this.slideNavIn, this));
  this.addPanelToView(bad.utils.makeId(), this.nav);
  this.nav.render();
};

app.user.view.Account.prototype.displayPanels = function() {

  if (this.nav) {
    this.nav.setUser(this.getUser());
    this.nav.resetMenu();
  } else {
    this.createNavPanel();
  }

  switch (this.landing_) {
    case 'orgList':
      this.enterOrgsList();
      break;
    default:
      this.enterOverview(this.landing_);
  }
};

/**
 * @param {bad.ActionEvent} e Event object.
 */
app.user.view.Account.prototype.onPanelAction = function(e) {

  var value = e.getValue();
  var data = e.getData();
  e.stopPropagation();

  switch (value) {
    case app.user.EventType.SIGNUP_CANCEL:
    case app.user.EventType.ACCOUNT_REMOVE_CANCELED:
    case app.user.EventType.EDIT_ACCOUNT_SUCCESS:
    case app.user.EventType.EDIT_PASSWORD_SUCCESS:
    case app.user.EventType.CANCEL_VIEW_ORG:
    case app.base.EventType.MENU_HEAD:
      this.closeRight();
      this.enterOverview();
      break;
    case app.user.EventType.ACCOUNT_REMOVE:
      this.confirmRemoveAccount();
      break;
    case app.user.EventType.EDIT_ACCOUNT:
      this.closeRight();
      this.enterEditForm();
      break;
    case app.user.EventType.EDIT_PW:
      this.closeRight();
      this.enterEditPasswordForm();
      break;
    case app.user.EventType.VIEW_ORG:
      this.closeRight();
      this.enterOrgsList();
      break;
    case app.doMap.VIEW_ORG_CREATE:
      this.switchView(goog.bind(this.appDo, this, value));
      break;
    case app.user.EventType.EDIT_ORG:
      this.switchView(
        goog.bind(this.appDo, this, app.doMap.VIEW_ORG, data.id));
      break;
    default:
      app.user.view.Account.superClass_.onPanelAction.call(this, e);
  }
};

//----------------------------------------------------------[ Overview Panel ]--

/**
 * An overview of the account
 * @param {(string|null)=} opt_id
 */
app.user.view.Account.prototype.enterOverview = function(opt_id) {

  if (this.nav) {
    this.nav.resetMenu();
  }

  var uriString = exp.urlMap.ACCOUNTS.READ;
  if (opt_id) {
    uriString = uriString + '/' + opt_id;
  }

  /**
   * @type {bad.ui.Panel}
   */
  var panel = new bad.ui.Panel();
  panel.setUri(new goog.Uri(uriString));
  panel.setUser(this.getUser());
  panel.setNestAsTarget(this.getLayout().getNest('main', 'center'));
  var beforeReadyCallback = goog.bind(function() {
    var editProfile = goog.dom.getElement('editProfile');
    this.getHandler().listen(
      editProfile,
      goog.events.EventType.CLICK,
      function() {
        this.dispatchActionEvent(app.user.EventType.EDIT_ACCOUNT);
      }
    );
  }, panel);
  panel.setBeforeReadyCallback(beforeReadyCallback);
  this.addPanelToView('replace', panel);
  panel.renderWithTemplate();
};

//-------------------------------------------------------[ Account Edit Form ]--

/**
 * The sign-up form is used for sign-up, editing accounts, and passwords.
 * It is destroyed on exit, and is thus recreated here each time it is called.
 */
app.user.view.Account.prototype.enterEditForm = function() {

  /**
   * @type {app.user.panel.Edit}
   */
  var form = new app.user.panel.Edit('account-form');
  form.setUri(new goog.Uri(exp.urlMap.ACCOUNTS.UPDATE));
  form.setUser(this.getUser());
  form.setNestAsTarget(this.getLayout().getNest('main', 'center'));
  this.addPanelToView('replace', form);
  form.renderWithTemplate();
};

app.user.view.Account.prototype.confirmRemoveAccount = function() {

  /**
   * @type {app.user.panel.Delete}
   */
  var form = new app.user.panel.Delete('confaccdel-form');
  form.setUri(new goog.Uri(exp.urlMap.ACCOUNTS.DELETE));
  form.setUser(this.getUser());
  form.setNestAsTarget(this.getLayout().getNest('main', 'center'));
  this.addPanelToView('replace', form);
  form.renderWithTemplate();
};

//------------------------------------------------------[ Password Edit Form ]--

/**
 * The sign-up form is used for sign-up, editing accounts, and passwords.
 * It is destroyed on exit, and is thus recreated here each time it is called.
 */
app.user.view.Account.prototype.enterEditPasswordForm = function() {

  /**
   * @type {app.user.panel.PasswordEdit}
   */
  var form = new app.user.panel.PasswordEdit('account-form');
  form.setUri(new goog.Uri(exp.urlMap.PW.EDIT));
  form.setUser(this.getUser());
  form.setNestAsTarget(this.getLayout().getNest('main', 'center'));
  this.addPanelToView('replace', form);
  form.renderWithTemplate();
};

//-------------------------------------------------------[ Organization Form ]--

/**
 * Presents the organization list
 */
app.user.view.Account.prototype.enterOrgsList = function() {

  /**
   * @type {app.org.panel.List}
   */
  var panel = new app.org.panel.List();
  panel.setUri(new goog.Uri(exp.urlMap.ORGS.READ));
  panel.setUser(this.getUser());
  panel.setNestAsTarget(this.getLayout().getNest('main', 'center'));
  this.addPanelToView('replace', panel);
  panel.renderWithTemplate();
};

// TODO: This shit does not belong here...
////-------------------------------------------------------[ Air Vantage Stuff ]--
//
///**
// * Creates two panels. One for the buttons, and one for the console feedback.
// * The console feedback is placed in the right nest.
// */
//app.user.view.Account.prototype.enterAVAPIView = function() {
//
//  var rPanelBeforeReadyCallback = function(panel, master) {
//    var consoleEl = goog.dom.createDom('pre', 'container-console_right');
//    goog.dom.appendChild(panel.getElement(), consoleEl);
//    master.setConsoleElement(consoleEl);
//    var size = 350;
//    var nest = this.getLayout().getNest('main', 'right');
//    nest.slideOpen(null, size);
//  };
//
//  /**
//   * @type {bad.ui.Panel}
//   */
//  var rPanel = new bad.ui.Panel();
//  rPanel.setUser(this.getUser());
//  rPanel.setNestAsTarget(this.getLayout().getNest('main', 'right'));
//  this.addPanelToView('rPanel', rPanel);
//
//
//  /**
//   * @type {app.user.panel.AvApi}
//   */
//  var panel = new app.user.panel.AvApi();
//  panel.setUri(new goog.Uri(exp.urlMap.AV.API));
//  panel.setUser(this.getUser());
//  panel.setNestAsTarget(this.getLayout().getNest('main', 'center'));
//  this.addPanelToView('replace', panel);
//  panel.renderWithTemplate();
//
//  rPanel.setBeforeReadyCallback(
//      goog.bind(rPanelBeforeReadyCallback, this, rPanel, panel)
//  );
//  rPanel.render();
//
//};
//
//app.user.view.Account.prototype.connectAv = function() {
//  var uri = new goog.Uri(exp.urlMap.AV.AUTH.CONNECT);
//  window.location.href = uri.toString();
//};
