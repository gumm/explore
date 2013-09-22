goog.provide('app.org.panel.List');

goog.require('bad.ui.Panel');

/**
 * A delete account confirmation form.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {bad.ui.Panel}
 * @constructor
 */
app.org.panel.List = function(opt_domHelper) {
  bad.ui.Panel.call(this, opt_domHelper);
};
goog.inherits(app.org.panel.List, bad.ui.Panel);

app.org.panel.List.prototype.initDom = function() {
  var tableElement = this.dom_.getElement('orgTable');

  bad.utils.makeButton('but-cancel', this,
    goog.bind(this.dispatchActionEvent, this,
      app.user.EventType.CANCEL_VIEW_ORG)
  );

  bad.utils.makeButton('createOrgBut', this,
    goog.bind(this.dispatchActionEvent, this, app.doMap.VIEW_ORG_CREATE)
  );

  if (tableElement) {
    var table = new bad.ui.Component();
    table.element_ = tableElement;
    table.setTarget(this.dom_.getElement('orgContainer'));
    this.addChild(table);

    this.getHandler().listen(
      table.element_,
      goog.events.EventType.CLICK,
      this.goGetTheCompanyWithThisId,
      false,
      this
    );

    var children = this.dom_.getChildren(this.dom_.getElement('orgBody'));
    goog.array.forEach(children, function(el) {
      goog.dom.classes.add(el, 'clickable');
    }, this);
  }
};

app.org.panel.List.prototype.goGetTheCompanyWithThisId = function(e) {
  var orgId = null;
  if (e.target.nodeName === 'TD') {
    var rowElement = e.target.parentElement;
    orgId = rowElement.id;
  }
  this.dispatchActionEvent(app.user.EventType.EDIT_ORG, {id: orgId});
};
