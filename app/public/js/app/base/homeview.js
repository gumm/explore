goog.provide('app.base.HomeView');

goog.require('bad.ui.View');

/**
 * @constructor
 * @extends {bad.ui.View}
 */
app.base.HomeView = function() {
    bad.ui.View.call(this);
};
goog.inherits(app.base.HomeView, bad.ui.View);

app.base.HomeView.prototype.configurePanels = function() {
    this.homePanel = new app.user.HomePanel();
    this.homePanel.setUri(new goog.Uri('/home'));
    this.homePanel.setNestAsTarget(this.getLayout().getNest('main', 'center'));
    this.addPanelToView('HOME', this.homePanel);
};

app.base.HomeView.prototype.displayPanels = function() {
    goog.object.forEach(this.panelMap, function(panel) {
        panel.renderWithTemplate();
    }, this);
};

app.base.HomeView.prototype.onPanelAction = goog.nullFunction;
