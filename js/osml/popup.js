/*
 * Popup class. Base for other popups.
 */
goog.provide('osml.Popup');
goog.require('ol.Overlay');
goog.require('osml');

osml.Popup = function(map, options) {
    options.element = this.createElement(map, options);
    goog.base(this, options);
};
goog.inherits(osml.Popup, ol.Overlay);

osml.Popup.prototype.createElement = function(map, options) {
    var popupId = 'olPopup-' + options.popupId;
    var popupClass = 'olPopup ' + options.popupClass;
    map.getOverlays().forEach(function(overlay) {
        if (overlay.getElement().id == popupId) {
            map.removeOverlay(overlay);
        };
    }, this);
    container = document.createElement('div');
    container.id = popupId;
    container.setAttribute('class', popupClass);
    content = document.createElement('div');
    content.id = 'popup-content';
    content.setAttribute('class', 'olPopupContent');
    container.appendChild(content);
    closer = document.createElement('a');
    closer.id = 'popup-closer';
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
    closer.onclick = function() {
        container.style.display = 'none';
        closer.blur();
        return false;
    };
    return container;
};
osml.Popup.prototype.setHTML = function(html) {
    this.content.innerHTML = html;
};
