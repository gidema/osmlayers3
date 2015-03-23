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
    var layer_defaults = {
        'interestingTagsExclude': ['source', 'source_ref', 
            'source:ref', 'history', 'attribution', 'created_by'],
        'areaTags': ['area', 'building', 'leisure', 'tourism', 'ruins',
            'historic', 'landuse', 'military', 'natural', 'sport'] 
    };
          
    layer_defaults = OpenLayers.Util.extend(layer_defaults, options);
        
    var interesting = {};
    for (var i = 0; i < layer_defaults.interestingTagsExclude.length; i++) {
        interesting[layer_defaults.interestingTagsExclude[i]] = true;
    }
    layer_defaults.interestingTagsExclude = interesting;
        
    var area = {};
    for (var i = 0; i < layer_defaults.areaTags.length; i++) {
        area[layer_defaults.areaTags[i]] = true;
    };
    layer_defaults.areaTags = area;

    areasAsNode = (options.areasAsNode === true);
};
goog.inherits(osml.FormatOSMJSON, ol.format.JSONFeature);

/**
 * APIMethod: read
 * Return a list of features from a OSM JSON string
 
 * Parameters:
 * jsonString - {String} 
 *
 * Returns:
 * Array({<OpenLayers.Feature.Vector>})
 */
osml.FormatOSMJSON.prototype.read = function(jsonString) {
    var json = ol.format.JSONFeature.prototype.read(jsonString);
    var nodes = this.getNodes(json);
    var ways = this.getWays(json);
    var centerNodes = this.getCenterNodes(json);

    // Geoms will contain at least ways.length entries.
    var feat_list = new Array(ways.length);

    for (var i = 0; i < ways.length; i++) {
        // We know the minimal of this one ahead of time. (Could be -1
        // due to areas/polygons)
        var point_list = new Array(ways[i].nodes.length);
        var poly = this.isWayArea(ways[i]) ? 1 : 0; 
        for (var j = 0; j < ways[i].nodes.length; j++) {
            var node = nodes[ways[i].nodes[j]];
            var point = new OpenLayers.Geometry.Point(node.lon, node.lat);
            // Since OSM is topological, we stash the node ID internally. 
            point.osm_id = parseInt(ways[i].nodes[j]);
            point_list[j] = point;

            // We don't display nodes if they're used inside other 
            // elements.
            node.used = true; 
        };
        var geometry = null;
        if (poly) { 
            geometry = new OpenLayers.Geometry.Polygon(
                new OpenLayers.Geometry.LinearRing(point_list));
        } else {    
            geometry = new OpenLayers.Geometry.LineString(point_list);
        };
        if (this.internalProjection && this.externalProjection) {
            geometry.transform(this.externalProjection, 
                this.internalProjection);
        };
        var feat = new OpenLayers.Feature.Vector(geometry,
            ways[i].tags);
        feat.osm_id = parseInt(ways[i].id);
        feat.fid = 'way.' + feat.osm_id;
        feat_list[i] = feat;
    }; 

    // Add the center nodes if any.
    for (var i = 0; i < centerNodes.length; i++) {
        var node = centerNodes[i];
        var feat = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.Point(node.lon, node.lat),
            node.tags);
        if (this.internalProjection && this.externalProjection) {
            feat.geometry.transform(this.externalProjection, 
                this.internalProjection);
        };
        feat.osm_id = parseInt(node.id);
        feat.fid = node.type + '.' + feat.osm_id + '.center';
        feat_list.push(feat);
    };

    // Add the nodes
    for (var node_id in nodes) {
        var node = nodes[node_id];
//        if (!node.used || this.checkTags) {
        if (!node.used) {
            var feat = new OpenLayers.Feature.Vector(
                new OpenLayers.Geometry.Point(node.lon, node.lat), node.tags);
            if (this.internalProjection && this.externalProjection) {
                feat.geometry.transform(this.externalProjection, 
                    this.internalProjection);
            }        
            feat.osm_id = parseInt(node_id); 
            feat.fid = 'node.' + feat.osm_id;
            feat_list.push(feat);
        }   
        // Memory cleanup
        node.node = null;
    }        
    return feat_list;
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
osml.FormatOSMJSON.prototype.getWays = function(json) {
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
osml.FormatOSMJSON.prototype.getCenterNodes = function(json) {
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
//    isWayArea: function(way) { 
//        var poly_shaped = false;
//        var poly_tags = false;
//        
//        if (way.nodes[0] == way.nodes[way.nodes.length - 1]) {
//            poly_shaped = true;
//        }
//        if (this.checkTags) {
//            for(var key in way.tags) {
//                if (this.areaTags[key]) {
//                    poly_tags = true;
//                    break;
//                }
//            }
//        }    
//        return poly_shaped && (this.checkTags ? poly_tags : true);            
//    }; 
