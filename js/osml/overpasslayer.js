goog.provide('osml.OverpassLayer');

goog.require('osml.OverpassSource');
goog.require('ol.layer.Vector');

osml.OverpassLayer = function(options) {
    this.name = options.name;
    this.cssClass = options.id;
    this.image = new ol.style.Icon( {
        src: 'img/markers/' + options.marker,
        width: 20,
        height: 24,
        yOffset: -24
    });
    this.style = new ol.style.Style( {
        image: this.image
    });
    this.source = new osml.OverpassSource(options.query);
    goog.base(this, {
//     ol.layer.Vector.call(this, {
        style : this.style,
        source : this.source
    });
    this.setVisible(false);
};

goog.inherits(osml.OverpassLayer, ol.layer.Vector);