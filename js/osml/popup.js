/*
 * Popup class. Base for other popups.
 */
goog.provide('osml.Popup');
goog.require('ol.Overlay');
goog.require('osml');

osml.Popup = function(options) {
    options.element = this.createElement(options);
    this.closeMode = options.closeMode || 'hide';
    goog.base(this, options);
};
goog.inherits(osml.Popup, ol.Overlay);

osml.Popup.prototype.createElement = function(options) {
    var popupId = 'olPopup-' + options.popupId;
    var cssClass = 'olPopup';
    if (options.cssClass) {
        cssClass += ' ' + options.cssClass;
    }
    var container = document.createElement('div');
    container.id = popupId;
    container.setAttribute('class', cssClass);
    var content = document.createElement('div');
    content.id = 'popup-content';
    content.setAttribute('class', 'olPopupContent');
    container.appendChild(content);
    var closer = document.createElement('a');
//    closer.id = 'popup-closer';
    closer.setAttribute('class', 'olPopupCloser');
    closer.setAttribute('href', '#');
    container.appendChild(closer);
    this.container = container;
    this.content = content;
    this.closer = closer;
    /**
    * Add a click handler to hide the popup.
    * @return {boolean} Don't follow the href.
    */
    closer.onclick = this.close(this);
    return container;
};
osml.Popup.prototype.close = function(self) {
    return function() {
        switch (self.closeMode) {
        case 'delete':
            self.getMap().removeOverlay(self);
            break;
        case 'hide':
            self.container.style.display = 'none';
            self.closer.blur();
        }
        return false;
    };
};
osml.Popup.prototype.show = function() {
    this.container.style.display = 'initial';
};
osml.Popup.prototype.setHTML = function(html) {
    this.content.innerHTML = html;
    this.show();
};
