/**
 * Type definitions for osml
 */

/**
 * Namespace for osml types
 *  @type {Object} 
 */
var osmlx;

/**
 * @typedef {{
 *   lon:number,
 *   lat:number,
 *   zoom:number,
 *   div:string,
 *   baseLayers:Array<ol.layer.Layer>
 * }}
 */
osmlx.MapOptions;

/**
 * @typedef {{
 *   type: string,
 *   id: (number | string | undefined),
 *   tags: Object<string, string>,
 *   usedTags: (Object<string, boolean> | null),
 *   lonlat: ol.Coordinate,
 *   lon: number,
 *   lat: number,
 *   zoom: (number | undefined)
 * }}
 */
osmlx.FeatureData;

/**
 * @typedef {{what: string, where: string, name: string, extent: ol.Extent}}
 */
osmlx.Query;


/**
 * @typedef {{
 *   name : string,
 *   layers : Array<string>,
 *   children : Object<string, osmlx.TreeNodeOptions>
 * }}
 */
osmlx.TreeNodeOptions;

/**
 * @typedef Object<string, osmlx.TreeNodeOptions>
 */
osmlx.TreeOptions;

/**
 * @typedef {{
 *   layers: Object<string, *>,
 *   treeData: osmlx.TreeOptions
 * }}
 */
osmlx.LayerTreeOptions;

/**
 * @typedef {{
 *   div:string,
 *   element:string,
 *   treeData:osmlx.TreeOptions
 * }}
 */
osmlx.LayerTreeControlOptions;

/**
 * Object literal with config options for the popup.
 * @typedef {{element: (Element|undefined),
 *     offset: (Array.<number>|undefined),
 *     position: (ol.Coordinate|undefined),
 *     positioning: (ol.OverlayPositioning|string|undefined),
 *     stopEvent: (boolean|undefined),
 *     insertFirst: (boolean|undefined),
 *     autoPan: (boolean|undefined),
 *     autoPanAnimation: (olx.animation.PanOptions|undefined),
 *     autoPanMargin: (number|undefined)}}
 * @api stable
 */
osmlx.PopupOptions;

/**
 * Namespace for the overpass types
 * @type {Object}
 */
osmlx.overpass;
/**
 * Namespace for the overpass types
 * @type {Object}
 */
osmlx.overpass.json;

/**
 * @typedef {{
 *   lat: number,
 *   lon: number
 * }}
 */
osmlx.overpass.json.Center;

/**
 * @typedef {{
 *   type: string,
 *   id: number,
 *   lat: number,
 *   lon: number,
 *   tags: Object<string,*>
 * }}
 */
osmlx.overpass.json.NodeElement;

/**
 * @typedef {{
 *   type: string,
 *   id: number,
 *   tags: Object<string,*>,
 *   nodes: Array<number>,
 *   center: osmlx.overpass.json.Center
 * }}
 */
osmlx.overpass.json.WayElement;

/**
 * @typedef {{
 *   type: string,
 *   id: number,
 *   tags: Object<string,*>,
 *   members: Array<osmlx.overpass.json.RelationMember>,
 *   center: osmlx.overpass.json.Center
 * }}
 */
osmlx.overpass.json.RelationMember;

/**
 * @typedef {{
 *   type: string,
 *   id: number
 * }}
 */
osmlx.overpass.json.RelationElement;

/**
 * @typedef {(osmlx.overpass.json.NodeElement | osmlx.overpass.json.WayElement | osmlx.overpass.json.RelationElement)}
 */
osmlx.overpass.json.Element;

/**
 * @typedef {{
 *   version: string,
 *   generator: string,
 *   osm3s: Object,
 *   elements: Array<osmlx.overpass.json.Element>
 * }}
 */
osmlx.overpass.json.JsonData;

/**
 * @typedef {{what: string, where: string, name: string, extent: ol.Extent}}
 */
osmlx.Query;

