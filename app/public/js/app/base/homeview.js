goog.provide('app.base.HomeView');

goog.require('bad.ui.View');

/**
 * @constructor
 * @extends {bad.ui.View}
 */
app.base.HomeView = function() {
    bad.ui.View.call(this, this);
};
goog.inherits(app.base.HomeView, bad.ui.View);

app.base.HomeView.prototype.configurePanels = function() {
    this.addPanelToView('HOME', new app.user.HomePanel(
        new goog.Uri('/home'),
        this.getLayout().getNest('main', 'center')
    ));
};

app.base.HomeView.prototype.displayPanels = function() {
    goog.object.forEach(this.panelMap, function(panel) {
        panel.renderWithTemplate();
    }, this);
};

app.base.HomeView.prototype.onPanelAction = goog.nullFunction;
