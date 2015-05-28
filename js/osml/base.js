goog.provide('osml');
goog.provide('osml.format');
goog.provide('osml.FeatureCollector');

/**
 * Base namespace for the OsmLayers library.  Checks to see osml is already
 * defined in the current scope before assigning to prevent clobbering if
 * base.js is loaded more than once.
 *
 * @const
 */

var osml = osml || {};

osml.VERSION='0.5.0';
osml.format = osml.format || {};

/**
 * Create a new OsmLayers site
 */
osml.init = function(options) {
    osml.site = new osml.Site(options);
};

////Utility classes
/**
 * @constructor
 */
osml.FeatureCollector = function() {
    this.features = [];
};
osml.FeatureCollector.prototype.callback = function(feature, layer) {
    this.features.push(feature);
};
//

/**
 * Utility functions
 */


/**
 * Create html code for a link
 * 
 * @param {string} href The target url
 * @param {(string | number)} text
 * @param {string=} target Target for the link. _blank if undefined
 * 
 * @returns {string} The html code
 */
osml.makeLink = function(href, text, target) {
    if (!(target)) {
        target = '_blank';
    }
    var html = '<a rel="external" target="' + target +'" ';
    if (href.indexOf(':') == -1) {
        href = '//' + href;
    }
    return html + 'href="' + href + '">' + text + '</a>';
};

/**
 * Capitalize the first letter of a string
 * @param {string} s
 * @returns {string}
 */
osml.capitalizeFirst = function(s) {
    if (!s) return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
};

//osml.formatString = function() {
//    var s = arguments[0];
//    for (var i = 0; i < arguments.length - 1; i++) {       
//      var reg = new RegExp('\\{' + i + '\\}', 'gm');             
//      s = s.replace(reg, arguments[i + 1]);
//    }
//    return s;
//};

osml.formatUrl = function(url, params) {
    var u = url;
    var first = true;
    for (var key in params) {
        if (first === true) {
            u = u + '?';
            first = false;
        }
        else {
            u = u + '&';
        }
        u = u + key + '=' + params[key];
    }
    return u;
};
/*
 * Get the center point of a geometry object
 */
osml.getCenter = function(geometry) {
    var extent = geometry.getExtent();
    return ol.extent.getCenter(extent);
};
