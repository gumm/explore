goog.provide('app.BasicView');

goog.require('bad.ui.View');

/**
 * @extends {bad.ui.View}
 * @constructor
 */
app.BasicView = function() {
  bad.ui.View.call(this);
};
goog.inherits(app.BasicView, bad.ui.View);

app.BasicView.prototype.slideNavIn = function() {
  var size = 310;
  var slider = this.getLayout().getNest('main', 'left');
  slider.slideOpen(null, size, goog.nullFunction);
};

/**
 * Closes both the left and right panels, and then calls the passed in function.
 * @param {Function=} opt_fn
 */
app.BasicView.prototype.switchView = function(opt_fn) {
  this.closeRight();
  this.closeLeft(opt_fn);
};

/**
 * Closes the right panel, and then calls the passed in function.
 * @param {Function=} opt_fn
 */
app.BasicView.prototype.closeRight = function(opt_fn) {
  var nest = this.getLayout().getNest('main', 'right');
  var callback = goog.bind(function() {
    nest.hide();
    opt_fn ? opt_fn() : goog.nullFunction();
  }, this);
  nest.slideClosed(callback);
};

/**
 * Closes the left panel, and then calls the passed in function.
 * @param {Function=} opt_fn
 */
app.BasicView.prototype.closeLeft = function(opt_fn) {
  var nest = this.getLayout().getNest('main', 'left');
  var callback = goog.bind(function() {
    nest.hide();
    opt_fn ? opt_fn() : goog.nullFunction();
  }, this);
  nest.slideClosed(callback);
};
