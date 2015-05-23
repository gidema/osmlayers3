goog.provide('osml.ProgressControl');
goog.require('ol.control.Control');
goog.require('osml');

/**
 * @constructor
 * @param options
 * @returns {osml.ProgressControl}
 */osml.ProgressControl = function(opt_options) {
    var options = opt_options || {};
    if (!options.element) {
        options.element = document.createElement('div');
        options.element.setAttribute('class', 'progressControl');
        options.element.style.display = 'none';
    }
    goog.base(this, options);
    this.tasks = {};
    this.active = false;
};
goog.inherits(osml.ProgressControl, ol.control.Control);

osml.ProgressControl.prototype.start = function(task) {
    this.tasks[task] = true;
    if (!this.active) {
        this.activate();
    }
};
osml.ProgressControl.prototype.ready = function(task) {
    delete this.tasks[task];
    var ready = true;
    for (var key in this.tasks) {
        ready = false;
    };
    if (ready) {
        this.deactivate();
    }
};
osml.ProgressControl.prototype.activate = function() {
    this.active = true;
    this.element.style.display = 'block'; //'visibility: visible');
};
osml.ProgressControl.prototype.deactivate = function() {
    this.active = false;
    this.element.style.display = 'none'; //.setAttribute('style', 'visibility: hidden');
};