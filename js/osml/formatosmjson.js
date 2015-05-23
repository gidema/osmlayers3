/* ======================================================================
    osml.FormatOSMJSON.js
   ====================================================================== */

/**  
 * Class: osml.FormatOSMJSON
 * OSM parser for json files like the ones produces by Overpass.
 * Create a new instance with the 
 *     <osml.FormatOSMJSON> constructor.
 *
 * Inherits from:
 *  - <OpenLayers.Format.XML>
 */
goog.provide('osml.FormatOSMJSON');
goog.require('ol.format.JSONFeature');

/**
 * @constructor
 * @returns {osml.FormatOSMJSON}
 */
osml.FormatOSMJSON = function() {
    goog.base(this);
    this.defaultDataProjection = ol.proj.get('EPSG:4326');
    /**
     * APIProperty: checkTags
     * {Boolean} Should tags be checked to determine whether something
     * should be treated as a seperate node. Will slow down parsing.
     * Default is false.
     */
    this.checkTags = false;

    /**
     * Property: interestingTagsExclude
     * {Array} List of tags to exclude from 'interesting' checks on nodes.
     * Must be set when creating the format. Will only be used if checkTags
     * is set.
     */
    this.interestingTagsExclude = null;
    
    /**
     * APIProperty: areaTags
     * {Array} List of tags indicating that something is an area.  
     * Must be set when creating the format. Will only be used if 
     * checkTags is true.
     */
    this.areaTags = null;
    
    /**
     * Extra Property: areasAsNode
     * If set to true, an area feature will be converted to a node
     * at the center of the area and with the same tags. 
     */
    this.areasAsNode = false;
    /**
     * Constructor: OpenLayers.Format.OSMJSON
     * Create a new parser for OSM JSON.
     *
     * Parameters:
     * options - {Object} An optional object whose properties will be set on
     *     this instance.
     */
//    var layer_defaults = {
//        'interestingTagsExclude': ['source', 'source_ref', 
//            'source:ref', 'history', 'attribution', 'created_by'],
//        'areaTags': ['area', 'building', 'leisure', 'tourism', 'ruins',
//            'historic', 'landuse', 'military', 'natural', 'sport'] 
//    };
          
//    layer_defaults = OpenLayers.Util.extend(layer_defaults, options);
//        
//    var interesting = {};
//    for (var i = 0; i < layer_defaults.interestingTagsExclude.length; i++) {
//        interesting[layer_defaults.interestingTagsExclude[i]] = true;
//    }
//    layer_defaults.interestingTagsExclude = interesting;
//        
//    var area = {};
//    for (var i = 0; i < layer_defaults.areaTags.length; i++) {
//        area[layer_defaults.areaTags[i]] = true;
//    };
//    layer_defaults.areaTags = area;
//
//    areasAsNode = (options.areasAsNode === true);
};
goog.inherits(osml.FormatOSMJSON, ol.format.JSONFeature);

/**
 * APIMethod: read
 * Return a list of features from an OSM JSON string
 
 * Parameters:
 * jsonString - {String} 
 *
 * Returns:
 * @return {Array.<ol.Feature>} Features.
 */
osml.FormatOSMJSON.prototype.readFeatures = function(json, options) {
    var data = this.readObjects_(json);
    var sourceProjection = this.defaultDataProjection;
    var targetProjection = options.featureProjection;

    var features = [];
    features = features.concat(this.readNodeFeatures_(data, sourceProjection,
            targetProjection));
    return features;

    // Add the center nodes if any.
//    goog.object.forEach(data.centers, function(center, id) {
//        var feature = osml.FormatOSMJSON.createFeature(
//            new ol.geom.Point([center.lon, center.lat]),
//            center);
//        if (this.internalProjection && this.externalProjection) {
//            feature.geometry.transform(this.externalProjection, 
//                this.internalProjection);
//        };
////        feat.fid = node.type + '.' + feat.osm_id + '.center';
//        features.push(feat);
//    });
//    return features;

//    // Add the nodes
//    for (var node_id in nodes) {
//        var node = nodes[node_id];
////        if (!node.used || this.checkTags) {
//        if (!node.used) {
//            var feat = osml.FormatOSMJSON.createFeature(
//                new ol.geom.Point([node.lon, node.lat]),
//                node);
//            if (this.internalProjection && this.externalProjection) {
//                feat.geometry.transform(this.externalProjection, 
//                    this.internalProjection);
//            }        
////            feat.fid = 'node.' + feat.osm_id;
//            feat_list.push(feat);
//        }   
//        // Memory cleanup
//        node.node = null;
//    }        
//    return feat_list;
};

/**
 * Method: readObjects
 * Read the objects from a JSON object.
 *
 * Parameters:
 * json - {Object} JSON object to read from
 */
osml.FormatOSMJSON.prototype.readObjects_ = function(json) {
    var data = {
            nodes: {},
            ways: {},
            relations: {},
            centers: {}
    };
    for (var i = 0; i < json.elements.length; i++) {
        var element = json.elements[i];
        var id = element.id;
        if (element.type == 'node') {
            data.nodes[id] = element;
        }
        else if (element.type == 'way') {
            data.ways[id] = element;
            if (element.center) {
                var center = {
                    id: element.id,
                    tags: element.tags,
                    type: 'way',
                    lat: element.center.lat,
                    lon: element.center.lon
                };
                data.centers[id] = center;
                var nodes = element.nodes;
                for (var j = 0; j < nodes.length; j++) {
                    delete data.nodes[nodes[j]];
                };
            };
        }
        else if (element.type == 'relation') {
            data.relations[id] = element;
            if (element.center) {
                var center = {
                    id: element.id,
                    tags: element.tags,
                    type: 'relation',
                    lat: element.center.lat,
                    lon: element.center.lon
                };
                data.centers[id] = center;
                var members = element.members;
                for (var j = 0; j < members.length; j++) {
                    var wayId = members[j].id;
                    delete data.ways[wayId];
                };
            };
        }
    };
    return data;
};

osml.FormatOSMJSON.prototype.readNodeFeatures_ = function(data, sourceProjection,
        targetProjection) {
    var features = [];
    for (var id in data.nodes) {
        var node = data.nodes[id];
        var geometry = this.readNodeGeometry_(node);
        geometry.transform(sourceProjection, targetProjection);
        var feature = this.createFeature_(geometry, node);
        features.push(feature);
    }; 
    for (var id in data.centers) {
        var center = data.centers[id];
        var geometry = this.readNodeGeometry_(center);
        geometry.transform(sourceProjection, targetProjection);
        var feature = this.createFeature_(geometry, center);
        features.push(feature);
    }; 
    return features;
};
/**
 * Method: getNodes
 * Return the node items from a doc.  
 *
 * Parameters:
 * json - {Object} object to parse tags from
 */
osml.FormatOSMJSON.prototype.getNodes = function(json) {
    var elements = json.elements;
    var nodes = {};
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        if (element.type == 'node') {
            var id = element.id;
            nodes[id] = element;
        };
    };
    return nodes;
};

/**
 * Method: getWays
 * Return the way items from a doc.  
 *
 * Parameters:
 * json - {Object} object to parse tags from
 */
osml.FormatOSMJSON.prototype.getWays_ = function(json) {
    var elements = json.elements;
    var ways = [];
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        if (element.type == 'way') {
            ways.push(element);
        };
    };
    return ways; 
};  
    
/**
 * Method: getCenterNodes
 * Return nodes for ways and relations that have a center element
 *   the center element is added by Overpass with the 'out center' option 
 * Return the relation items from a doc only if the relation has a center specified
 * Parameters:
 * json - {Object} object to parse tags from
 */
osml.FormatOSMJSON.prototype.getCenterNodes_ = function(json) {
    var centerNodes = [];
    var wayUsed = {};
    
    var elements = json.elements;
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        if (element.type == 'relation' && element.center) {
            var centerNode = {
                id: element.id,
                tags: element.tags,
                type: 'relation',
                lat: element.center.lat,
                lon: element.center.lon
            };
            centerNodes.push(centerNode);
            var members = element.members;
            for (var j = 0; j < members.length; j++) {
                var wayId = members[j].id;
                wayUsed[wayId] = true;
            };
        };
    };
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        if (element.type == 'way' && element.center) {
            var wayId = element.id;
            if (!wayUsed[wayId]) {
                var centerNode = {
                    id: element.id,
                    tags: element.tags,
                    type: 'way',
                    lat: element.center.lat,
                    lon: element.center.lon
                };
                centerNodes.push(centerNode);
            };
        };
    };
    return centerNodes; 
};

/**
 * @inheritDoc
 */
osml.FormatOSMJSON.prototype.readProjection_ = function(source) {
    return this.defaultDataProjection;
};

/**
 * Method: getTags
 * Return the tags list attached to a specific DOM element.
 *
 * Parameters:tags to check
 * interesting_tags - {Boolean} whether the return from this function should
 *    return a boolean indicating that it has 'interesting tags' -- 
 *    tags like attribution and source are ignored. (To change the list
 *    of tags, see interestingTagsExclude)
 * 
 * Returns:
 * tags - {Object} hash of tags
 * interesting - {Boolean} if interesting_tags is passed, returns
 *     whether there are any interesting tags on this element.
 */
//osml.FormatOSMJSON.prototype.getTags = function(tags, interesting_tags) {
//    var interesting = false;
//    for (var key in tags) {
//        tags[key] = tag_list[j].getAttribute('v');
//       if (interesting_tags) {
//            if (!this.interestingTagsExclude[key]) {
//                interesting = true;
//            }
//        }    
//    }  
//    return interesting_tags ? [tags, interesting] : tags;     
//};

/** 
 * Method: isWayArea
 * Given a way object from getWays, check whether the tags and geometry
 * indicate something is an area.
 *
 * Returns:
 * {Boolean}
 */
osml.FormatOSMJSON.prototype.isWayArea_ = function(way, checkTags) { 
    var poly_shaped = false;
    var poly_tags = false;
    
    if (way.nodes[0] == way.nodes[way.nodes.length - 1]) {
        poly_shaped = true;
    };
    if (this.checkTags) {
        for(var key in way.tags) {
            if (this.areaTags[key]) {
                poly_tags = true;
                break;
            };
        };
    };
    return poly_shaped && (this.checkTags ? poly_tags : true);            
};
osml.FormatOSMJSON.prototype.readNodeGeometry_ = function(object) {
    return new ol.geom.Point([object.lon, object.lat]);
};
osml.FormatOSMJSON.prototype.readWayGeometry_ = function(object, nodes) {
    var coordinates = new Array(object.nodes.length);
    for (var i = 0; i < object.nodes.length; i++) {
        var node = nodes[object.nodes[i]];
        var point = [node.lon, node.lat];
        coordinates[i] = point;

        // We don't display nodes if they're used inside other 
        // elements.
        node.used = true; 
    };
    if (this.isWayArea_(object)) { 
        return new ol.geom.Polygon([coordinates]);
    } else {    
        return new ol.geom.LineString(coordinates);
    };
};
//osml.FormatOSMJSON.readRelationGeometry_ = function(object) {
//    return new ol.geom.Point([node.lon, node.lat]);
//};
osml.FormatOSMJSON.prototype.createFeature_ = function(geometry, entity) {
    var feature = new ol.Feature(geometry);
    for (var key in entity.tags) {
        feature.set(key, entity.tags[key]);
    };
    feature.setId(parseInt(entity.id));
    return feature;
};