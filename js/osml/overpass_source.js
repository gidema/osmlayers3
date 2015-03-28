goog.provide('osml.OverpassSource');

goog.require('osml');
goog.require('ol.source.ServerVector');
goog.require('ol.format.OSMXML');
goog.require('osml.FormatOSMJSON');
goog.require('osml.ProgressControl');

osml.OverpassSource = function(query, options) {
    this.name = 'overpassSource' + osml.OverpassSource.getNextId_();
    this.useJson = false;
//    this.useJson = options.useJson;
    this.format = osml.OverpassSource.createFormat_(this.useJson);
    goog.base(this, {
        format : this.format,
        loader : function(extent, resolution, projection) {
            var self = this;
            var progressControl = osml.site.progressControl;
            progressControl.start(self.name);
            var epsg4326Extent = ol.proj.transformExtent(extent, projection,
                    'EPSG:4326');
            var url = 'http://overpass-api.de/api/interpreter/?data='
                + (self.useJson ? '[out:json];':'')
                + osml.OverpassSource.createFilter_(query) + "&bbox="
                + epsg4326Extent.join(',');
            $.ajax(url).then(function(response) {
                self.addFeatures(self.readFeatures(response));
                progressControl.ready(self.name);
            });
        },
        strategy : function(extent, resolution) {
            return [ extent ];
        },
        projection: 'EPSG:3857'
    });
};
goog.inherits(osml.OverpassSource, ol.source.ServerVector);

osml.OverpassSource.id = 1;
osml.OverpassSource.getNextId_ = function() {
    return osml.OverpassSource.id++;
};

osml.OverpassSource.createFormat_ = function(useJson) {
    if (useJson) {
        return new osml.FormatOSMJSON();
    }
    else {
        return new ol.format.OSMXML();
    };
};

/**
 * Static functions
 */
osml.OverpassSource.createFilter_ = function(query) {
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
