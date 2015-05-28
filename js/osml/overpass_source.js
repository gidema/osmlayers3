goog.provide('osml.OverpassSource');

goog.require('osml');
goog.require('ol.source.Vector');
goog.require('ol.format.OSMXML');
goog.require('osml.FormatOSMJSON');
goog.require('osml.ProgressControl');
goog.require('osml.Query');

/**
 * @constructor
 * @extends {ol.source.Vector}
 * @param query
 * @param options
 * @returns {osml.OverpassSource}
 */
osml.OverpassSource = function(query, options) {
    /** @type ol.proj.Projection */
    this.projection = ol.proj.get("EPSG:4326");
    this.query = query;
    this.name = osml.OverpassSource.getNextId_();
    this.useJson = options.useJson;
    this.format = osml.OverpassSource.createFormat_(options.useJson);
    this.progressListener = options.progressListener;
    goog.base(this, {
        loader : goog.bind(this.loader, this),
        strategy : function(extent, resolution) {
            return [ extent ];
        }
    });
};
goog.inherits(osml.OverpassSource, ol.source.Vector);

osml.OverpassSource.id = 1;
osml.OverpassSource.getNextId_ = function() {
    return 'overpassSource' + osml.OverpassSource.id++;
};

osml.OverpassSource.prototype.loader = function(extent, resolution, projection) {
    if (this.progressListener) {
        this.progressListener.start(this.name);
    }
    var epsg4326Extent = ol.proj.transformExtent(extent, projection,
            this.projection);
    var url = 'http://overpass-api.de/api/interpreter/?data='
        + (this.useJson ? '[out:json];':'')
        + osml.OverpassSource.createFilter_(this.query) + "&bbox="
        + epsg4326Extent.join(',');
    $.ajax(url, {context: this}).then(function(response) {
        this.addFeatures(this.format.readFeatures(response, {
            featureProjection: projection,
            dataProjection: this.projection
        }));
        if (this.progressListener) {
            this.progressListener.ready(this.name);
        }
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
