goog.provide('osml.OverpassSource');

goog.require('osml');
goog.require('ol.source.ServerVector');
goog.require('ol.format.OSMXML');
goog.require('osml.FormatOSMJSON');
goog.require('osml.ProgressControl');
goog.require('osml.Query');

osml.OverpassSource = function(query, options) {
    this.query = query;
    this.name = osml.OverpassSource.getNextId_();
    this.useJson = options.useJson;
    var format = osml.OverpassSource.createFormat_(this.useJson);
    goog.base(this, {
        format : format,
        loader : goog.bind(this.loader, this),
        strategy : function(extent, resolution) {
            return [ extent ];
        },
        projection: 'EPSG:3857'
    });
};
goog.inherits(osml.OverpassSource, ol.source.ServerVector);

osml.OverpassSource.id = 1;
osml.OverpassSource.getNextId_ = function() {
    return 'overpassSource' + osml.OverpassSource.id++;
};

osml.OverpassSource.prototype.loader = function(extent, resolution, projection) {
    var progressControl = osml.site.progressControl;
    progressControl.start(this.name);
    var epsg4326Extent = ol.proj.transformExtent(extent, projection,
            'EPSG:4326');
    var url = 'http://overpass-api.de/api/interpreter/?data='
        + (this.useJson ? '[out:json];':'')
        + osml.OverpassSource.createFilter_(this.query) + "&bbox="
        + epsg4326Extent.join(',');
    var self = this;
    $.ajax(url).then(function(response) {
        self.addFeatures(self.readFeatures(response));
        progressControl.ready(self.name);
    });
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
