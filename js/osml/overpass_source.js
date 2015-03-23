goog.provide('osml.OverpassSource');

goog.require('osml');
goog.require('ol.source.ServerVector');
goog.require('ol.format.OSMXML');

osml.OverpassSource = function(query) {
    goog.base(this, {
        format : new ol.format.OSMXML(),
        loader : function(extent, resolution, projection) {
            var epsg4326Extent = ol.proj.transformExtent(extent, projection,
                    'EPSG:4326');
            var url = 'http://overpass-api.de/api/interpreter/?data='
                    + osml.OverpassSource.createFilter(query) + "&bbox="
                    + epsg4326Extent.join(',');
            self = this;
            $.ajax(url).then(function(response) {
                self.addFeatures(self.readFeatures(response));
            });
        },
        strategy : function(extent, resolution) {
            return [ extent ];
        },
        projection: 'EPSG:3857'
    });
};

/**
 * Static functions
 */
osml.OverpassSource.createFilter = function(query) {
    var f = "(";
    var parts = query.split(",");
    if (parts.length > 1) {
        $.each(parts, function(index, value) {
            f += "node" + value + "(bbox);way" + value + "(bbox);rel" + value
                    + "(bbox);";
        });
        return f + ");(._;>;);out center;";
    }
    return "(node[" + query + "](bbox);way[" + query + "](bbox);rel[" + query
            + "](bbox););(._;>;);out center;";
};

goog.inherits(osml.OverpassSource, ol.source.ServerVector);