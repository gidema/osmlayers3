goog.provide('osml.format.OSMXML');
goog.provide('osml.format.OSMXML.GeometryFactory');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.dom.NodeType');
goog.require('goog.object');
goog.require('ol.Feature');
goog.require('ol.format.Feature');
goog.require('ol.format.XMLFeature');
goog.require('ol.geom.GeometryLayout');
goog.require('ol.geom.LineString');
goog.require('ol.geom.Point');
goog.require('ol.geom.Polygon');
goog.require('ol.proj');
goog.require('ol.xml');
goog.require('osml.format');

/**
 * @classdesc
 * Feature format for reading data in the
 * [OSMXML format](http://wiki.openstreetmap.org/wiki/OSM_XML).
 *
 * @constructor
 * @extends {ol.format.XMLFeature}
 * @api stable
 */
/**
 * @author Gertjan Idema <mail@gertjanidema.nl>
 *
 */
osml.format.OSMXML = function(opt_options) {
  goog.base(this);
  this.geometryFactory = new osml.format.OSMXML.GeometryFactory();
  if (opt_options) {
    if (opt_options.geometryFactory) {
      this.geometryFactory = opt_options.geometryFactory;
  }
  }

  /**
   * @inheritDoc
   */
  this.defaultDataProjection = ol.proj.get('EPSG:4326');
};
goog.inherits(osml.format.OSMXML, ol.format.XMLFeature);


/**
 * @const
 * @type {Array.<string>}
 * @private
 */
osml.format.OSMXML.EXTENSIONS_ = ['.osm'];


/**
 * @inheritDoc
 */
osml.format.OSMXML.prototype.getExtensions = function() {
  return osml.format.OSMXML.EXTENSIONS_;
};


/**
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @private
 */
osml.format.OSMXML.readNode_ = function(node, objectStack) {
  goog.asserts.assert(node.nodeType == goog.dom.NodeType.ELEMENT,
      'node.nodeType should be ELEMENT');
  goog.asserts.assert(node.localName == 'node', 'localName should be node');
  var options = /** @type {olx.format.ReadOptions} */ (objectStack[0]);
  var state = /** @type {Object} */ (objectStack[objectStack.length - 1]);
  var id = node.getAttribute('id');
  var coordinates = /** @type {Array.<number>} */ ([
    parseFloat(node.getAttribute('lon')),
    parseFloat(node.getAttribute('lat'))
  ]);
  state.nodes[id] = coordinates;

  var values = ol.xml.pushParseAndPop({
    tags: {}
  }, osml.format.OSMXML.NODE_PARSERS_, node, objectStack);
  if (!goog.object.isEmpty(values.tags)) {
    var geometry = new ol.geom.Point(coordinates);
    ol.format.Feature.transformWithOptions(geometry, false, options);
    var feature = new ol.Feature(geometry);
    feature.setId(id);
    feature.setProperties(values.tags);
    state.features.push(feature);
  }
};


/**
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @private
 */
osml.format.OSMXML.readWay_ = function(node, objectStack) {
  goog.asserts.assert(node.nodeType == goog.dom.NodeType.ELEMENT,
      'node.nodeType should be ELEMENT');
  goog.asserts.assert(node.localName == 'way', 'localName should be way');
  var options = /** @type {olx.format.ReadOptions} */ (objectStack[0]);
  var id = node.getAttribute('id');
  var values = ol.xml.pushParseAndPop({
    ndrefs: [],
    tags: {}
  }, osml.format.OSMXML.WAY_PARSERS_, node, objectStack);
  var geometry = this.geometryFactory.geometryForWay(values, objectStack, id);
  var state = /** @type {Object} */ (objectStack[objectStack.length - 1]);
//  var flatCoordinates = /** @type {Array.<number>} */ ([]);
//  for (var i = 0, ii = values.ndrefs.length; i < ii; i++) {
//    var point = state.nodes[values.ndrefs[i]];
//    goog.array.extend(flatCoordinates, point);
//  }
//  var geometry;
//  if (values.ndrefs[0] == values.ndrefs[values.ndrefs.length - 1]) {
//    // closed way
//    geometry = new ol.geom.Polygon(null);
//    geometry.setFlatCoordinates(ol.geom.GeometryLayout.XY, flatCoordinates,
//        [flatCoordinates.length]);
//  } else {
//    geometry = new ol.geom.LineString(null);
//    geometry.setFlatCoordinates(ol.geom.GeometryLayout.XY, flatCoordinates);
//  }
  ol.format.Feature.transformWithOptions(geometry, false, options);
  var feature = new ol.Feature(geometry);
  feature.setId(id);
  feature.setProperties(values.tags);
  state.features.push(feature);
};


/**
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @private
 * @return {ol.Feature|undefined} Track.
 */
osml.format.OSMXML.readNd_ = function(node, objectStack) {
  goog.asserts.assert(node.nodeType == goog.dom.NodeType.ELEMENT,
      'node.nodeType should be ELEMENT');
  goog.asserts.assert(node.localName == 'nd', 'localName should be nd');
  var values = /** @type {Object} */ (objectStack[objectStack.length - 1]);
  values.ndrefs.push(node.getAttribute('ref'));
};


/**
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @private
 * @return {ol.Feature|undefined} Track.
 */
osml.format.OSMXML.readTag_ = function(node, objectStack) {
  goog.asserts.assert(node.nodeType == goog.dom.NodeType.ELEMENT,
      'node.nodeType should be ELEMENT');
  goog.asserts.assert(node.localName == 'tag', 'localName should be tag');
  var values = /** @type {Object} */ (objectStack[objectStack.length - 1]);
  values.tags[node.getAttribute('k')] = node.getAttribute('v');
};


/**
 * @const
 * @private
 * @type {Array.<string>}
 */
osml.format.OSMXML.NAMESPACE_URIS_ = [
  null
];


/**
 * @const
 * @type {Object.<string, Object.<string, ol.xml.Parser>>}
 * @private
 */
osml.format.OSMXML.WAY_PARSERS_ = ol.xml.makeParsersNS(
    osml.format.OSMXML.NAMESPACE_URIS_, {
      'nd': osml.format.OSMXML.readNd_,
      'tag': osml.format.OSMXML.readTag_
    });


/**
 * @const
 * @type {Object.<string, Object.<string, ol.xml.Parser>>}
 * @private
 */
osml.format.OSMXML.PARSERS_ = ol.xml.makeParsersNS(
    osml.format.OSMXML.NAMESPACE_URIS_, {
      'node': osml.format.OSMXML.readNode_,
      'way': osml.format.OSMXML.readWay_
    });


/**
 * @const
 * @type {Object.<string, Object.<string, ol.xml.Parser>>}
 * @private
 */
osml.format.OSMXML.NODE_PARSERS_ = ol.xml.makeParsersNS(
    osml.format.OSMXML.NAMESPACE_URIS_, {
      'tag': osml.format.OSMXML.readTag_
    });


/**
 * Read all features from an OSM source.
 *
 * @function
 * @param {ArrayBuffer|Document|Node|Object|string} source Source.
 * @param {olx.format.ReadOptions=} opt_options Read options.
 * @return {Array.<ol.Feature>} Features.
 * @api stable
 */
osml.format.OSMXML.prototype.readFeatures;


/**
 * @inheritDoc
 */
osml.format.OSMXML.prototype.readFeaturesFromNode = function(node, opt_options) {
  goog.asserts.assert(node.nodeType == goog.dom.NodeType.ELEMENT,
      'node.nodeType should be ELEMENT');
  var options = this.getReadOptions(node, opt_options);
  if (node.localName == 'osm') {
    var state = ol.xml.pushParseAndPop({
      nodes: {},
      features: []
    }, osml.format.OSMXML.PARSERS_, node, [options], this);
    if (goog.isDef(state.features)) {
      return state.features;
    }
  }
  return [];
};


/**
 * Read the projection from an OSM source.
 *
 * @function
 * @param {ArrayBuffer|Document|Node|Object|string} source Source.
 * @return {ol.proj.Projection} Projection.
 * @api stable
 */
osml.format.OSMXML.prototype.readProjection;

/**
 * Default geometry factory
 * 
 * @class
 */
osml.format.OSMXML.GeometryFactory = function() {};

/**
 * Create the geometry for a way.
 * If the way is closed, the geometry will be of type Polygon.
 * Otherwise a LineString will be returned
 * 
 * @function
 * @param {Object} values
 * @return {ol.geom.LineString | ol.geom.Polygon} geometry
 */
osml.format.OSMXML.GeometryFactory.prototype.geometryForWay = function(values, objectStack) {
    var state = /** @type {Object} */ (objectStack[objectStack.length - 1]);
    var flatCoordinates = /** @type {Array.<number>} */ ([]);
    for (var i = 0, ii = values.ndrefs.length; i < ii; i++) {
      var point = state.nodes[values.ndrefs[i]];
      goog.array.extend(flatCoordinates, point);
    }
    var geometry;
    if (values.ndrefs[0] == values.ndrefs[values.ndrefs.length - 1]) {
      // closed way
      geometry = new ol.geom.Polygon(null);
      geometry.setFlatCoordinates(ol.geom.GeometryLayout.XY, flatCoordinates,
          [flatCoordinates.length]);
    } else {
      geometry = new ol.geom.LineString(null);
      geometry.setFlatCoordinates(ol.geom.GeometryLayout.XY, flatCoordinates);
    }
    return geometry;
};