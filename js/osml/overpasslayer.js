goog.provide('osml.OverpassLayer');

goog.require('osml.OverpassSource');
goog.require('ol.layer.Vector');

/**
 * @constructor
 * @extends {ol.layer.Vector}
 * @param options
 * @param layerOptions
 * @returns {osml.OverpassLayer}
 */osml.OverpassLayer = function(options, layerOptions) {
    this.name = layerOptions.name;
    this.cssClass = layerOptions.id;
    this.image = new ol.style.Icon( {
        src: options.imgPath + '/' + layerOptions.marker,
        width: 20,
        height: 24,
        yOffset: -24,
        getImage: function(pixelRatio) {
            return 'img/markers/' + layerOptions.marker;
        }
    });
    this.style = new ol.style.Style( {
        image: this.image
    });
    this.source = new osml.OverpassSource(layerOptions.query, {
        useJson: true,
        progressListener: options.progressListener
    });
    goog.base(this, {
        style : this.style,
        source : this.source
    });
    this.setVisible(false);
};

goog.inherits(osml.OverpassLayer, ol.layer.Vector);