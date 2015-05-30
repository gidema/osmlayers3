/*
 * Popup class. Base for other popups.
 */
goog.provide('osml.Popup');
goog.require('ol.Overlay');
goog.require('osml');

/**
 * @constructor
 * @extends ol.Overlay
 * @param {osmlx.PopupOptions} options
 * @returns {osml.Popup}
 */
osml.Popup = function(options) {
    /** @type {Element} */
    this.content;
    /** @type {Element} */
    this.container;
    /** @type {Element} */
    this.closer;
    options.element = this.createElement(options);
    options.autoPan = true;
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
    var content = options.element;
    if (!content) {
        content = document.createElement('div');
        content.id = 'popup-content';
        content.className = 'olPopupContent';
    }
    else {
        content.className += ' olPopupContent';
    }
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
        self.getMap().removeOverlay(self);
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
